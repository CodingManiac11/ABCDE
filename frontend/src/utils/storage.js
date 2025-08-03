/**
 * Storage Utility
 * 
 * This utility provides a type-safe way to interact with localStorage and sessionStorage.
 * It includes support for expiration times, JSON serialization, and type checking.
 */

// Storage types
export const STORAGE_TYPES = {
  LOCAL: 'local',
  SESSION: 'session',
};

// Default expiration time (1 day in milliseconds)
const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Gets the appropriate storage API based on type
 * @param {string} type - The storage type (local or session)
 * @returns {Storage} The storage API instance
 */
const getStorage = (type = STORAGE_TYPES.LOCAL) => {
  if (typeof window === 'undefined') {
    throw new Error('Storage is not available in this environment');
  }
  
  return type === STORAGE_TYPES.LOCAL ? localStorage : sessionStorage;
};

/**
 * Creates a storage key with optional prefix
 * @param {string} key - The base key
 * @param {string} [prefix] - Optional prefix for the key
 * @returns {string} The prefixed key
 */
const createKey = (key, prefix) => {
  return prefix ? `${prefix}:${key}` : key;
};

/**
 * Serializes a value for storage
 * @param {*} value - The value to serialize
 * @param {Object} [options] - Serialization options
 * @param {number} [options.expiresIn] - Expiration time in milliseconds
 * @returns {string} The serialized value
 */
const serialize = (value, { expiresIn } = {}) => {
  const data = {
    value,
    _timestamp: Date.now(),
  };
  
  if (expiresIn) {
    data._expires = Date.now() + expiresIn;
  }
  
  return JSON.stringify(data);
};

/**
 * Deserializes a stored value
 * @param {string} value - The stored value
 * @returns {*} The deserialized value or null if expired
 */
const deserialize = (value) => {
  try {
    if (!value) return null;
    
    const data = JSON.parse(value);
    
    // Check if the item has expired
    if (data._expires && Date.now() > data._expires) {
      return null;
    }
    
    return data.value;
  } catch (error) {
    console.error('Error deserializing storage value:', error);
    return null;
  }
};

/**
 * Sets a value in storage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional key prefix
 * @param {number} [options.expiresIn] - Expiration time in milliseconds
 */
export const setItem = (key, value, { type = STORAGE_TYPES.LOCAL, prefix, expiresIn } = {}) => {
  try {
    const storage = getStorage(type);
    const storageKey = createKey(key, prefix);
    const serializedValue = serialize(value, { expiresIn });
    
    storage.setItem(storageKey, serializedValue);
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};

/**
 * Gets a value from storage
 * @param {string} key - The storage key
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional key prefix
 * @param {*} [defaultValue] - Default value if item doesn't exist or is expired
 * @returns {*} The stored value or defaultValue
 */
export const getItem = (key, { type = STORAGE_TYPES.LOCAL, prefix, defaultValue = null } = {}) => {
  try {
    const storage = getStorage(type);
    const storageKey = createKey(key, prefix);
    const storedValue = storage.getItem(storageKey);
    
    if (storedValue === null) return defaultValue;
    
    const value = deserialize(storedValue);
    
    // Remove the item if it has expired
    if (value === null) {
      removeItem(key, { type, prefix });
      return defaultValue;
    }
    
    return value;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

/**
 * Removes an item from storage
 * @param {string} key - The storage key
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional key prefix
 */
export const removeItem = (key, { type = STORAGE_TYPES.LOCAL, prefix } = {}) => {
  try {
    const storage = getStorage(type);
    const storageKey = createKey(key, prefix);
    storage.removeItem(storageKey);
  } catch (error) {
    console.error('Error removing storage item:', error);
  }
};

/**
 * Clears all items from storage (with optional prefix)
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional prefix to limit which items are cleared
 */
export const clear = ({ type = STORAGE_TYPES.LOCAL, prefix } = {}) => {
  try {
    const storage = getStorage(type);
    
    if (!prefix) {
      // Clear all items if no prefix is provided
      storage.clear();
      return;
    }
    
    // Only clear items with the specified prefix
    const prefixToRemove = `${prefix}:`;
    const keysToRemove = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key.startsWith(prefixToRemove)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Gets all keys in storage (with optional prefix)
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional prefix to filter keys
 * @returns {string[]} Array of storage keys
 */
export const getKeys = ({ type = STORAGE_TYPES.LOCAL, prefix } = {}) => {
  try {
    const storage = getStorage(type);
    const keys = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!prefix || key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    
    return keys;
  } catch (error) {
    console.error('Error getting storage keys:', error);
    return [];
  }
};

/**
 * Checks if a key exists in storage
 * @param {string} key - The storage key
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional key prefix
 * @returns {boolean} True if the key exists and is not expired
 */
export const hasItem = (key, { type = STORAGE_TYPES.LOCAL, prefix } = {}) => {
  try {
    const storage = getStorage(type);
    const storageKey = createKey(key, prefix);
    const item = storage.getItem(storageKey);
    
    if (item === null) return false;
    
    // Check if the item has expired
    const data = JSON.parse(item);
    return !(data._expires && Date.now() > data._expires);
  } catch (error) {
    console.error('Error checking storage item:', error);
    return false;
  }
};

/**
 * Gets the remaining time until a key expires
 * @param {string} key - The storage key
 * @param {Object} [options] - Storage options
 * @param {string} [options.type=local] - Storage type (local or session)
 * @param {string} [options.prefix] - Optional key prefix
 * @returns {number|null} Remaining time in milliseconds, or null if not expiring or not found
 */
export const getExpiration = (key, { type = STORAGE_TYPES.LOCAL, prefix } = {}) => {
  try {
    const storage = getStorage(type);
    const storageKey = createKey(key, prefix);
    const item = storage.getItem(storageKey);
    
    if (item === null) return null;
    
    const data = JSON.parse(item);
    
    if (!data._expires) return null;
    
    const remaining = data._expires - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Error getting storage expiration:', error);
    return null;
  }
};

// Create a namespaced storage interface
export const createStorage = (options = {}) => {
  const { prefix, type = STORAGE_TYPES.LOCAL, defaultExpiration } = options;
  
  return {
    set: (key, value, expiresIn = defaultExpiration) => 
      setItem(key, value, { ...options, expiresIn }),
    
    get: (key, defaultValue) => 
      getItem(key, { ...options, defaultValue }),
    
    remove: (key) => 
      removeItem(key, options),
    
    clear: () => 
      clear(options),
    
    keys: () => 
      getKeys(options),
    
    has: (key) => 
      hasItem(key, options),
    
    getExpiration: (key) => 
      getExpiration(key, options),
      
    withPrefix: (newPrefix) => 
      createStorage({ ...options, prefix: prefix ? `${prefix}:${newPrefix}` : newPrefix }),
      
    withType: (newType) => 
      createStorage({ ...options, type: newType }),
      
    withExpiration: (newExpiration) => 
      createStorage({ ...options, defaultExpiration: newExpiration })
  };
};

// Default export with common configuration
export default createStorage({
  prefix: 'app',
  type: STORAGE_TYPES.LOCAL,
  defaultExpiration: DEFAULT_EXPIRATION,
});

// Example usage:
/*
// Basic usage
import storage from './storage';

// Set a value that expires in 1 hour
storage.set('user', { id: 1, name: 'John' }, 60 * 60 * 1000);

// Get a value with a default
const user = storage.get('user', { id: 0, name: 'Guest' });

// Create a namespaced storage
const userStorage = storage.withPrefix('user');
userStorage.set('preferences', { theme: 'dark' });

// Create a session storage instance
const session = createStorage({ type: STORAGE_TYPES.SESSION });
session.set('sessionId', 'abc123');
*/
