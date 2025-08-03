// File type constants
const FILE_TYPES = {
  IMAGE: {
    label: 'Image',
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    accept: 'image/*',
    icon: '🖼️',
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  DOCUMENT: {
    label: 'Document',
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    accept: '.pdf,.doc,.docx',
    icon: '📄',
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  SPREADSHEET: {
    label: 'Spreadsheet',
    mimeTypes: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    accept: '.xls,.xlsx',
    icon: '📊',
    maxSize: 10 * 1024 * 1024, // 10MB
  },
};

// Default upload options
const DEFAULT_OPTIONS = {
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024, // 5MB
  accept: FILE_TYPES.IMAGE.accept,
  multiple: true,
  uploadPath: 'uploads',
  onProgress: null,
};

/**
 * Format bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Validates a file against type and size constraints
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {{isValid: boolean, error: string|null}} Validation result
 */
const validateFile = (file, options = {}) => {
  const { fileType = 'IMAGE', maxSize = DEFAULT_OPTIONS.maxSize } = options;
  const typeConfig = FILE_TYPES[fileType] || FILE_TYPES.IMAGE;
  
  if (!typeConfig.mimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please upload a ${typeConfig.label.toLowerCase()} file.`,
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File is too large. Maximum size is ${formatFileSize(maxSize)}.`,
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The file to create a preview for
 * @returns {Promise<string>} Data URL of the image
 */
const createPreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

/**
 * Revokes a preview URL to free up memory
 * @param {string} url - The URL to revoke
 */
const revokePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Gets file icon based on file type
 * @param {string} mimeType - File MIME type
 * @returns {string} Icon class or emoji
 */
const getFileIcon = (mimeType) => {
  if (!mimeType) return '📄';
  
  if (mimeType.startsWith('image/')) {
    return '🖼️';
  }
  
  if (mimeType.includes('pdf')) {
    return '📄';
  }
  
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return '📝';
  }
  
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return '📊';
  }
  
  if (mimeType.includes('zip') || mimeType.includes('compressed')) {
    return '🗜️';
  }
  
  return '📄';
};

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
const uploadFile = async (file, options = {}) => {
  const { onProgress } = { ...DEFAULT_OPTIONS, ...options };
  
  // Simulate upload progress
  const total = file.size;
  let loaded = 0;
  const chunkSize = Math.ceil(total / 10);
  
  while (loaded < total) {
    loaded = Math.min(loaded + chunkSize, total);
    const progress = Math.round((loaded / total) * 100);
    
    if (onProgress) {
      onProgress(progress, { loaded, total });
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Simulate server response
  return {
    success: true,
    filename: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
};

/**
 * Checks if a file is an image based on its MIME type
 * @param {File|string} file - File object or MIME type string
 * @returns {boolean} True if the file is an image
 */
const isImage = (file) => {
  const mimeType = typeof file === 'string' ? file : file.type;
  return mimeType ? mimeType.startsWith('image/') : false;
};

// Export all utility functions
export {
  FILE_TYPES,
  DEFAULT_OPTIONS,
  validateFile,
  createPreview,
  revokePreview,
  formatFileSize,
  getFileIcon,
  uploadFile,
  isImage,
};
