import {
  validateFile,
  generateUniqueFilename,
  getFileExtension,
  formatFileSize,
  getFileIcon,
  isImage,
  createPreview,
  revokePreview,
} from '../fileUpload';

describe('File Upload Utility', () => {
  // Mock File object
  const createMockFile = (name, size, type) => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('validateFile', () => {
    it('should validate file size', () => {
      const file = createMockFile('test.jpg', 6 * 1024 * 1024, 'image/jpeg');
      const result = validateFile(file, { fileType: 'IMAGE', maxSize: 5 * 1024 * 1024 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('should validate file type', () => {
      const file = createMockFile('test.pdf', 1024, 'application/pdf');
      const result = validateFile(file, { fileType: 'IMAGE' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should pass validation for valid file', () => {
      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      const result = validateFile(file, { fileType: 'IMAGE' });
      expect(result.isValid).toBe(true);
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate a unique filename with original extension', () => {
      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      const filename = generateUniqueFilename(file, { addOriginalExtension: true });
      expect(filename).toMatch(/\.jpg$/i);
      expect(filename).toMatch(/^[a-f0-9-]+\.jpg$/i);
    });

    it('should generate a unique filename without extension', () => {
      const file = createMockFile('test.jpg', 1024, 'image/jpeg');
      const filename = generateUniqueFilename(file, { addOriginalExtension: false });
      expect(filename).not.toMatch(/\./);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension from filename', () => {
      const file = createMockFile('document.pdf', 1024, 'application/pdf');
      expect(getFileExtension(file)).toBe('pdf');
    });

    it('should return empty string for files without extension', () => {
      const file = createMockFile('document', 1024, 'text/plain');
      expect(getFileExtension(file)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes to human-readable size', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
      expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
    });
  });

  describe('getFileIcon', () => {
    it('should return appropriate icon for image files', () => {
      expect(getFileIcon('image/jpeg')).toBe('🖼️');
      expect(getFileIcon('image/png')).toBe('🖼️');
    });

    it('should return appropriate icon for document files', () => {
      expect(getFileIcon('application/pdf')).toBe('📕');
      expect(getFileIcon('application/msword')).toBe('📝');
    });

    it('should return default icon for unknown types', () => {
      expect(getFileIcon('application/unknown')).toBe('📄');
    });
  });

  describe('isImage', () => {
    it('should detect image files', () => {
      expect(isImage('image/jpeg')).toBe(true);
      expect(isImage('image/png')).toBe(true);
      expect(isImage('image/gif')).toBe(true);
    });

    it('should detect non-image files', () => {
      expect(isImage('application/pdf')).toBe(false);
      expect(isImage('text/plain')).toBe(false);
    });
  });

  describe('createPreview and revokePreview', () => {
    let file;
    
    beforeEach(() => {
      file = createMockFile('test.jpg', 1024, 'image/jpeg');
      // Mock FileReader
      global.URL.createObjectURL = jest.fn(() => 'blob:mocked');
      global.URL.revokeObjectURL = jest.fn();
    });

    it('should create a preview URL for an image', async () => {
      const mockResult = 'data:image/jpeg;base64,';
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: mockResult,
        onload: jest.fn(),
        onerror: jest.fn(),
        DONE: 2,
        readyState: 2,
      };
      
      global.FileReader = jest.fn(() => mockFileReader);
      
      const previewPromise = createPreview(file);
      mockFileReader.onload({ target: { result: mockResult } });
      
      const previewUrl = await previewPromise;
      expect(previewUrl).toBe(mockResult);
    });

    it('should create an object URL for non-image files', async () => {
      const pdfFile = createMockFile('test.pdf', 1024, 'application/pdf');
      const previewUrl = await createPreview(pdfFile);
      expect(previewUrl).toBe('blob:mocked');
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(pdfFile);
    });

    it('should revoke object URLs', () => {
      const url = 'blob:test';
      revokePreview(url);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(url);
    });

    it('should not revoke non-blob URLs', () => {
      const url = 'data:image/jpeg;base64,';
      revokePreview(url);
      expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
    });
  });

  // Note: The following tests would require mocking the actual file upload
  // and compression functionality, which is more complex and might be better
  // suited for integration tests with a test server.
  
  describe.skip('uploadFile', () => {
    // Tests for uploadFile would go here
  });

  describe.skip('uploadFiles', () => {
    // Tests for uploadFiles would go here
  });

  describe.skip('compressImage', () => {
    // Tests for compressImage would go here
  });

  describe.skip('generateThumbnail', () => {
    // Tests for generateThumbnail would go here
  });
});
