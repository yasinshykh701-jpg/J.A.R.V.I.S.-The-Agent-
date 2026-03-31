import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, Upload, Download, Sparkles, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { 
  submitImageGeneration, 
  queryImageStatus, 
  fileToBase64,
  type ImageGenerationRequest 
} from '@/services/aiServices';

export default function ImageGenerationPageNew() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 3 images for multi-image composition
    const validFiles = files.slice(0, 3).filter(f => 
      f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/webp'
    );

    if (validFiles.length === 0) {
      toast.error('Please upload PNG, JPEG, or WebP images only');
      return;
    }

    setUploadedFiles(validFiles);

    // Generate previews
    const previews: string[] = [];
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews[index] = reader.result as string;
        if (previews.filter(Boolean).length === validFiles.length) {
          setUploadedPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    toast.success(`${validFiles.length} image(s) uploaded`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);
    setTaskId(null);
    setProgress('Preparing request...');

    try {
      // Build request based on mode
      const request: ImageGenerationRequest = {
        contents: [{
          parts: []
        }]
      };

      // Add uploaded images if any
      if (uploadedFiles.length > 0) {
        setProgress(`Processing ${uploadedFiles.length} image(s)...`);
        
        for (const file of uploadedFiles) {
          const base64 = await fileToBase64(file);
          request.contents[0].parts.push({
            inline_data: {
              mime_type: file.type,
              data: base64 // Pure base64 without prefix
            }
          });
        }
        
        toast.info(`${uploadedFiles.length > 1 ? 'Multi-image composition' : 'Image-to-image'} mode activated`);
      } else {
        toast.info('Text-to-image generation started');
      }

      // Add text prompt
      request.contents[0].parts.push({ text: prompt });

      // Submit task
      setProgress('Submitting to AI...');
      const submitResponse = await submitImageGeneration(request);

      if (submitResponse.status !== 0 || !submitResponse.data?.taskId) {
        throw new Error(submitResponse.message || 'Failed to submit task');
      }

      const newTaskId = submitResponse.data.taskId;
      setTaskId(newTaskId);
      setProgress('Generation in progress...');
      toast.success('Task submitted! Generating image...');

      // Poll for status every 8 seconds
      let attempts = 0;
      const maxAttempts = 75; // 10 minutes max (75 * 8 seconds)
      
      const pollStatus = async () => {
        attempts++;
        setProgress(`Generating... (${Math.floor(attempts * 8 / 60)}m ${(attempts * 8) % 60}s)`);

        try {
          const statusResponse = await queryImageStatus(newTaskId);

          if (statusResponse.status !== 0) {
            throw new Error(statusResponse.message || 'Failed to query status');
          }

          const taskStatus = statusResponse.data?.status;

          if (taskStatus === 'SUCCESS') {
            const imageUrl = statusResponse.data?.imageUrl;
            if (imageUrl) {
              setGeneratedImage(imageUrl);
              setProgress('Complete!');
              toast.success('🎨 Image generated successfully!');
              setIsLoading(false);
              return;
            } else {
              throw new Error('No image URL in response');
            }
          } else if (taskStatus === 'FAILED') {
            throw new Error(statusResponse.data?.error || 'Generation failed');
          } else if (taskStatus === 'PENDING') {
            // Continue polling
            if (attempts >= maxAttempts) {
              throw new Error('Generation timeout - please try again');
            }
            setTimeout(pollStatus, 8000); // Poll every 8 seconds
          } else {
            throw new Error(`Unknown status: ${taskStatus}`);
          }
        } catch (error: any) {
          console.error('Polling error:', error);
          toast.error(error.message || 'Status check failed');
          setIsLoading(false);
          setProgress('Failed');
        }
      };

      // Start polling after 5 seconds
      setTimeout(pollStatus, 5000);

    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error(error.message || 'Failed to generate image');
      setIsLoading(false);
      setProgress('Error');
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `qazyen-image-${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  const clearUploads = () => {
    setUploadedFiles([]);
    setUploadedPreviews([]);
    toast.info('Uploads cleared');
  };

  const examplePrompts = [
    'A futuristic city at sunset with flying cars',
    'A cute robot playing with a kitten in a garden',
    'Abstract art with vibrant colors and geometric shapes',
    'A serene mountain landscape with a crystal clear lake',
  ];

  return (
    <AppLayout>
      <BackToHome />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">AI Image Generation</h1>
          </div>
          <p className="text-white/80">
            Create stunning images with AI • 100% Free & Unlimited Forever
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>
                  Supports text-to-image, image-to-image, and multi-image composition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Example Prompts */}
                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {examplePrompts.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(example)}
                        className="text-xs h-auto py-2 text-left justify-start"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="imageUpload">
                    Reference Images (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Images (Max 3)
                    </Button>
                    {uploadedFiles.length > 0 && (
                      <Button variant="ghost" size="icon" onClick={clearUploads}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload 1 image for style transfer, or 2-3 for intelligent composition
                  </p>
                </div>

                {/* Uploaded Previews */}
                {uploadedPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedPreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {progress}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                {taskId && (
                  <div className="text-xs text-muted-foreground text-center">
                    Task ID: {taskId}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-white">Image Generation API: 100% Operational</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  All services are lifetime free and unlimited
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>
                  Your AI-generated masterpiece will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button onClick={handleDownload} className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                    <div className="text-center p-6">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {isLoading ? 'Generating your image...' : 'Your generated image will appear here'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
