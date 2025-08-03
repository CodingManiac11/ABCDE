import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { 
  uploadFile, 
  isImage, 
  createPreview, 
  revokePreview, 
  formatFileSize,
  validateFile,
  FILE_TYPES
} from '../../utils/fileUpload';
import { toast } from 'react-toastify';

const ImageUpload = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = FILE_TYPES.IMAGE.accept,
  multiple = true,
  label = 'Drag & drop images here, or click to select',
  uploadPath = 'products',
  disabled = false,
  className = '',
}) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const fileInputRef = useRef(null);

  // Initialize with existing value
  useEffect(() => {
    if (value && value.length > 0) {
      setFiles(value);
    }
  }, [value]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          revokePreview(file.preview);
        }
      });
    };
  }, [files]);

  const processFile = useCallback(async (file) => {
    // Validate file
    const validation = validateFile(file, { 
      fileType: 'IMAGE',
      maxSize,
      mimeTypes: FILE_TYPES.IMAGE.mimeTypes
    });

    if (!validation.isValid) {
      toast.error(validation.error);
      return null;
    }

    // Create preview
    const preview = await createPreview(file);
    
    return {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview,
      status: 'pending',
      progress: 0,
    };
  }, [maxSize]);

  const handleAddFiles = useCallback(async (newFiles) => {
    if (disabled) return;

    // Check max files limit
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Take only remaining slots
    const filesToProcess = Array.from(newFiles).slice(0, remainingSlots);
    
    setIsUploading(true);
    
    try {
      // Process files in parallel
      const processedFiles = await Promise.all(
        filesToProcess.map(file => processFile(file))
      );
      
      // Filter out any null values from failed validations
      const validFiles = processedFiles.filter(Boolean);
      
      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        
        // Upload files
        await Promise.all(
          validFiles.map(file => handleUpload(file.id))
        );
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error processing files');
    } finally {
      setIsUploading(false);
    }
  }, [files, maxFiles, disabled, processFile]);

  const handleUpload = useCallback(async (fileId) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const fileObj = files[fileIndex];
    
    try {
      // Update file status to uploading
      const updatedFiles = [...files];
      updatedFiles[fileIndex] = { 
        ...fileObj, 
        status: 'uploading',
        progress: 0,
      };
      setFiles(updatedFiles);

      // Upload the file
      const result = await uploadFile(
        fileObj.file,
        {
          path: uploadPath,
          onProgress: (progress) => {
            setProgress(prev => ({
              ...prev,
              [fileId]: progress,
            }));
            
            const updatedProgressFiles = [...files];
            const progressIndex = updatedProgressFiles.findIndex(f => f.id === fileId);
            if (progressIndex !== -1) {
              updatedProgressFiles[progressIndex] = {
                ...updatedProgressFiles[progressIndex],
                progress,
              };
              setFiles(updatedProgressFiles);
            }
          },
        }
      );

      // Update file status to uploaded
      const updatedFilesAfterUpload = [...files];
      const uploadedFileIndex = updatedFilesAfterUpload.findIndex(f => f.id === fileId);
      
      if (uploadedFileIndex !== -1) {
        updatedFilesAfterUpload[uploadedFileIndex] = {
          ...updatedFilesAfterUpload[uploadedFileIndex],
          ...result.data, // Assuming the server returns file info
          status: 'done',
          progress: 100,
        };
        
        setFiles(updatedFilesAfterUpload);
        
        // Notify parent component
        if (onChange) {
          onChange(updatedFilesAfterUpload.filter(f => f.status === 'done'));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Update file status to error
      const updatedFiles = [...files];
      const errorIndex = updatedFiles.findIndex(f => f.id === fileId);
      
      if (errorIndex !== -1) {
        updatedFiles[errorIndex] = {
          ...updatedFiles[errorIndex],
          status: 'error',
          error: error.message || 'Upload failed',
        };
        
        setFiles(updatedFiles);
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  }, [files, uploadPath, onChange]);

  const handleRemove = useCallback((fileId, event) => {
    event.stopPropagation();
    
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove && fileToRemove.preview) {
      revokePreview(fileToRemove.preview);
    }
    
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    
    // Notify parent component
    if (onChange) {
      onChange(updatedFiles.filter(f => f.status === 'done'));
    }
  }, [files, onChange]);

  const onDrop = useCallback(acceptedFiles => {
    handleAddFiles(acceptedFiles);
  }, [handleAddFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: disabled || isUploading || files.length >= maxFiles,
  });

  const handleClick = () => {
    if (!disabled && !isUploading && files.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const renderPreview = (file) => {
    const isDone = file.status === 'done';
    const isUploading = file.status === 'uploading';
    const isError = file.status === 'error';
    
    return (
      <div key={file.id} className="relative group">
        <div className="relative overflow-hidden rounded-lg bg-gray-100">
          {file.preview && isImage(file) ? (
            <img
              src={file.preview}
              alt={file.name}
              className="h-24 w-full object-cover"
            />
          ) : (
            <div className="h-24 w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">Preview not available</span>
            </div>
          )}
          
          {/* Progress bar */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 ${
            isError ? 'bg-opacity-50 opacity-100' : ''
          }`}>
            <button
              type="button"
              onClick={(e) => handleRemove(file.id, e)}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Error indicator */}
          {isError && (
            <div className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="mt-1 text-xs text-gray-600 truncate" title={file.name}>
          {file.name}
        </div>
        <div className="text-xs text-gray-500">
          {formatFileSize(file.size)}
          {isUploading && ` • ${file.progress}%`}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input 
          {...getInputProps()} 
          ref={fileInputRef}
          className="hidden"
          disabled={disabled || isUploading || files.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg 
            className={`h-12 w-12 ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <span>Drop the files here</span>
            ) : (
              <span>{label}</span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {`${accept} • Max ${maxSize / (1024 * 1024)}MB`}
            {maxFiles > 1 && ` • Max ${maxFiles} files`}
          </div>
        </div>
      </div>
      
      {/* File previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map(renderPreview)}
        </div>
      )}
      
      {/* Uploading indicator */}
      {isUploading && (
        <div className="text-sm text-gray-600">
          Uploading {files.filter(f => f.status === 'uploading').length} file(s)...
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  label: PropTypes.string,
  uploadPath: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ImageUpload;
