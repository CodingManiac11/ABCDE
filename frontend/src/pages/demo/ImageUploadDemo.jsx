import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ImageUpload from '../../components/common/ImageUpload';
import { toast } from 'sonner';

const ImageUploadDemo = () => {
  const [singleImage, setSingleImage] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const [customConfig, setCustomConfig] = useState({
    maxFiles: 3,
    maxSize: 2, // MB
    disabled: false,
    uploadPath: 'demo',
  });
  
  const [customImages, setCustomImages] = useState([]);
  
  const handleCustomConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'maxSize' ? Number(value) : value
    }));
  };
  
  const handleSubmit = async () => {
    // In a real app, you would submit the form data along with the uploaded files
    const formData = {
      singleImage: singleImage[0],
      multipleImages,
      customImages,
    };
    
    console.log('Form data:', formData);
    
    // Simulate API call
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Form submitted successfully!', {
        description: 'Check the console for the form data.',
      });
    } catch (error) {
      toast.error('Error submitting form', {
        description: error.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Image Upload Demo</h1>
        <p className="text-muted-foreground">
          A reusable image upload component with drag & drop support
        </p>
      </div>
      
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="single">Single Image</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Images</TabsTrigger>
          <TabsTrigger value="custom">Custom Config</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Single Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <ImageUpload
                    value={singleImage}
                    onChange={setSingleImage}
                    maxFiles={1}
                    multiple={false}
                    label="Click or drag & drop a profile picture"
                    uploadPath="profile"
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Current Image:</h3>
                  {singleImage.length > 0 ? (
                    <div className="inline-block border rounded-lg overflow-hidden">
                      <img 
                        src={singleImage[0].preview || singleImage[0].url} 
                        alt="Preview" 
                        className="h-32 w-32 object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No image selected</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multiple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multiple Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Gallery</Label>
                  <ImageUpload
                    value={multipleImages}
                    onChange={setMultipleImages}
                    maxFiles={10}
                    multiple={true}
                    label="Upload up to 10 product images"
                    uploadPath="products"
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-2">
                    {multipleImages.length} Image{multipleImages.length !== 1 ? 's' : ''} Selected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {multipleImages.map((img, index) => (
                      <div key={img.id || index} className="relative group">
                        <img 
                          src={img.preview || img.url} 
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maxFiles">Max Files: {customConfig.maxFiles}</Label>
                        <Input
                          id="maxFiles"
                          name="maxFiles"
                          type="number"
                          min="1"
                          max="10"
                          value={customConfig.maxFiles}
                          onChange={handleCustomConfigChange}
                          className="w-20"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maxSize">Max Size (MB): {customConfig.maxSize}</Label>
                        <Input
                          id="maxSize"
                          name="maxSize"
                          type="number"
                          min="0.1"
                          max="20"
                          step="0.1"
                          value={customConfig.maxSize}
                          onChange={handleCustomConfigChange}
                          className="w-20"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="uploadPath">Upload Path:</Label>
                        <Input
                          id="uploadPath"
                          name="uploadPath"
                          type="text"
                          value={customConfig.uploadPath}
                          onChange={handleCustomConfigChange}
                          className="w-40"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="disabled">Disabled:</Label>
                        <Switch
                          id="disabled"
                          name="disabled"
                          checked={customConfig.disabled}
                          onCheckedChange={(checked) => 
                            setCustomConfig(prev => ({ ...prev, disabled: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={customImages.length === 0}
                    >
                      Submit Form
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Uploader</Label>
                  <ImageUpload
                    value={customImages}
                    onChange={setCustomImages}
                    maxFiles={customConfig.maxFiles}
                    maxSize={customConfig.maxSize * 1024 * 1024}
                    multiple={customConfig.maxFiles > 1}
                    disabled={customConfig.disabled}
                    label={customConfig.disabled ? 'Uploader is disabled' : 'Try uploading some files'}
                    uploadPath={customConfig.uploadPath}
                    className={customConfig.disabled ? 'opacity-70' : ''}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Current Configuration:</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {JSON.stringify({
                    maxFiles: customConfig.maxFiles,
                    maxSize: `${customConfig.maxSize} MB`,
                    disabled: customConfig.disabled,
                    uploadPath: customConfig.uploadPath,
                    fileCount: customImages.length,
                    files: customImages.map(f => ({
                      name: f.name,
                      size: f.size,
                      type: f.type,
                      status: f.status,
                    })),
                  }, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Check the browser console for form submission data</p>
      </div>
    </div>
  );
};

export default ImageUploadDemo;
