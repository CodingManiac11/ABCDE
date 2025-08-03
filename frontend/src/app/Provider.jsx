import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { Loader } from '../components/common';

/**
 * Provider component that wraps the application with Redux store and PersistGate
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
const Provider = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<Loader fullScreen />} persistor={persistor}>
        {children}
      </PersistGate>
    </ReduxProvider>
  );
};

export default Provider;
