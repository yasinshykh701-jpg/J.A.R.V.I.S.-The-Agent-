import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Loader2, Download, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { supabase } from '@/services/aiServices';

type ServiceType = 'kling' | 'advanced' | 'omni-image';

export default function AIImageGenerationPage() {
  const [activeService, setActiveService] = useState<ServiceType>('kling');
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('1k');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll task status for Kling AI Image Generation
  const pollKlingImageStatus = async (id: string) => {
    const maxAttempts = 48; // 4 minutes max (48 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('kling-image-query', {
          body: { task_id: id }
        });

        if (error) throw error;

        const taskStatus = data?.data?.task_status;
        const taskResult = data?.data?.task_result;

        setProgress(Math.min(95, (attempts / maxAttempts) * 100));

        if (taskStatus === 'succeed' && taskResult?.images?.[0]?.url) {
          setImageUrl(taskResult.images[0].url);
          setStatus('completed');
          setProgress(100);
          toast.success('Image generated successfully! ⚡ Fast generation');
          return;
        }

        if (taskStatus === 'failed') {
          setStatus('failed');
          toast.error(data?.data?.task_status_msg || 'Image generation failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts && (taskStatus === 'submitted' || taskStatus === 'processing')) {
          setTimeout(poll, 5000); // Poll every 5 seconds (faster)
        } else if (attempts >= maxAttempts) {
          setStatus('failed');
          toast.error('Image generation timeout');
        }
      } catch (err: any) {
        console.error('Poll error:', err);
        setStatus('failed');
        toast.error(err.message || 'Failed to check image status');
      }
    };

    poll();
  };

  // Poll task status for Advanced Image Generation
  const pollAdvancedImageStatus = async (id: string) => {
    const maxAttempts = 48; // 4 minutes max (48 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('advanced-image-query', {
          body: { taskId: id }
        });

        if (error) throw error;

        const taskStatus = data?.data?.status;
        const taskResult = data?.data?.result;

        setProgress(Math.min(95, (attempts / maxAttempts) * 100));

        if (taskStatus === 'SUCCESS' && taskResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const imageData = taskResult.candidates[0].content.parts[0].text;
          // Extract base64 from markdown format
          const match = imageData.match(/!\[image\]\((data:image\/[^;]+;base64,[^)]+)\)/);
          if (match) {
            setImageUrl(match[1]);
            setStatus('completed');
            setProgress(100);
            toast.success('Image generated successfully!');
          } else {
            throw new Error('Invalid image format');
          }
          return;
        }

        if (taskStatus === 'FAILED') {
          setStatus('failed');
          toast.error(data?.data?.error?.message || 'Image generation failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts && taskStatus === 'PENDING') {
          setTimeout(poll, 5000); // Poll every 5 seconds (faster)
        } else if (attempts >= maxAttempts) {
          setStatus('failed');
          toast.error('Image generation timeout');
        }
      } catch (err: any) {
        console.error('Poll error:', err);
        setStatus('failed');
        toast.error(err.message || 'Failed to check image status');
      }
    };

    poll();
  };

  // Poll task status for Omni-Image
  const pollOmniImageStatus = async (id: string) => {
    const maxAttempts = 48; // 4 minutes max (48 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('omni-image-query', {
          body: { task_id: id }
        });

        if (error) throw error;

        const taskStatus = data?.data?.task_status;
        const taskResult = data?.data?.task_result;

        setProgress(Math.min(95, (attempts / maxAttempts) * 100));

        if (taskStatus === 'succeed' && taskResult?.images?.[0]?.url) {
          setImageUrl(taskResult.images[0].url);
          setStatus('completed');
          setProgress(100);
          toast.success('Image generated successfully!');
          return;
        }

        if (taskStatus === 'failed') {
          setStatus('failed');
          toast.error('Image generation failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts && (taskStatus === 'submitted' || taskStatus === 'processing')) {
          setTimeout(poll, 5000); // Poll every 5 seconds (faster)
        } else if (attempts >= maxAttempts) {
          setStatus('failed');
          toast.error('Image generation timeout');
        }
      } catch (err: any) {
        console.error('Poll error:', err);
        setStatus('failed');
        toast.error(err.message || 'Failed to check image status');
      }
    };

    poll();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setReferenceImage(base64);
        toast.success('Reference image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateKling = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGenerating(true);
    setStatus('generating');
    setProgress(0);
    setImageUrl(null);

    try {
      const requestBody: any = {
        prompt,
        resolution,
        aspect_ratio: aspectRatio,
        n: 1
      };

      // Add reference image if provided
      if (referenceImage) {
        requestBody.image = referenceImage;
        requestBody.image_fidelity = 0.5;
      }

      const { data, error } = await supabase.functions.invoke('kling-image-create', {
        body: requestBody
      });

      if (error) throw error;

      if (data?.data?.task_id) {
        setTaskId(data.data.task_id);
        toast.success('Image generation started! ⚡ Fast mode enabled');
        pollKlingImageStatus(data.data.task_id);
      } else {
        throw new Error('No task ID received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setStatus('failed');
      toast.error(error.message || 'Failed to start image generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAdvanced = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGenerating(true);
    setStatus('generating');
    setProgress(0);
    setImageUrl(null);

    try {
      const contents: any = [{
        parts: []
      }];

      // Add reference image if provided
      if (referenceImage) {
        const base64Data = referenceImage.split(',')[1]; // Remove data:image/...;base64, prefix
        const mimeType = referenceImage.match(/data:([^;]+);/)?.[1] || 'image/png';
        
        contents[0].parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        });
      }

      // Add text prompt
      contents[0].parts.push({
        text: prompt
      });

      const { data, error } = await supabase.functions.invoke('advanced-image-submit', {
        body: { contents }
      });

      if (error) throw error;

      if (data?.data?.taskId) {
        setTaskId(data.data.taskId);
        toast.success('Image generation started!');
        pollAdvancedImageStatus(data.data.taskId);
      } else {
        throw new Error('No task ID received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setStatus('failed');
      toast.error(error.message || 'Failed to start image generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOmniImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGenerating(true);
    setStatus('generating');
    setProgress(0);
    setImageUrl(null);

    try {
      const requestBody: any = {
        prompt,
        resolution,
        aspect_ratio: aspectRatio,
        n: 1,
        result_type: 'single'
      };

      // Add reference image if provided
      if (referenceImage) {
        requestBody.image_list = [{ image: referenceImage }];
      }

      const { data, error } = await supabase.functions.invoke('omni-image-create', {
        body: requestBody
      });

      if (error) throw error;

      if (data?.data?.task_id) {
        setTaskId(data.data.task_id);
        toast.success('Image generation started!');
        pollOmniImageStatus(data.data.task_id);
      } else {
        throw new Error('No task ID received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setStatus('failed');
      toast.error(error.message || 'Failed to start image generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (activeService === 'kling') {
      handleGenerateKling();
    } else if (activeService === 'advanced') {
      handleGenerateAdvanced();
    } else {
      handleGenerateOmniImage();
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `qazyen-image-${Date.now()}.png`;
      link.click();
      toast.success('Image download started');
    }
  };

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
            Generate images with multiple AI services • 100% Free Forever • ⚡ Fast (1-5 min)
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              4 Services Online
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
              ⚡ Fast Generation (1-5 min)
            </span>
          </div>
        </div>

        <Tabs value={activeService} onValueChange={(v) => setActiveService(v as ServiceType)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kling">Kling AI (Fast) ⚡</TabsTrigger>
            <TabsTrigger value="advanced">Advanced (Gemini)</TabsTrigger>
            <TabsTrigger value="omni-image">Omni-Image</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Image Settings</CardTitle>
              <CardDescription>
                {activeService === 'kling'
                  ? '⚡ Fast image generation with Kling AI (1-5 minutes)'
                  : activeService === 'advanced' 
                  ? 'Advanced image generation with Gemini AI (1-5 minutes)'
                  : 'High-quality image generation with Omni-Image (1-5 minutes)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Image Description *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate... (e.g., 'A beautiful sunset over mountains with vibrant colors')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Reference Image (Optional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {referenceImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {referenceImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setReferenceImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {referenceImage && (
                  <img src={referenceImage} alt="Reference" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>

              {(activeService === 'kling' || activeService === 'omni-image') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger id="resolution">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1k">1K (1024px)</SelectItem>
                        <SelectItem value="2k">2K (2048px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger id="aspectRatio">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || status === 'generating'}
                className="w-full"
                size="lg"
              >
                {isGenerating || status === 'generating' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

              {status === 'generating' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {activeService === 'kling' ? '⚡ Fast generation: 1-5 minutes' : 'Generation time: 1-5 minutes. Please wait...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>Your AI-generated image will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter a description and click "Generate Image" to start
                  </p>
                </div>
              )}

              {status === 'generating' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-foreground font-medium mb-2">Generating your image...</p>
                  <p className="text-sm text-muted-foreground">
                    {activeService === 'kling' ? '⚡ Fast generation: 1-5 minutes' : 'Generation time: 1-5 minutes'}
                  </p>
                </div>
              )}

              {status === 'failed' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                  <p className="text-foreground font-medium mb-2">Generation failed</p>
                  <p className="text-sm text-muted-foreground">
                    Please try again with a different prompt
                  </p>
                </div>
              )}

              {status === 'completed' && imageUrl && (
                <div className="space-y-4">
                  <img
                    src={imageUrl}
                    alt="Generated"
                    className="w-full rounded-lg"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                  <Button onClick={handleDownload} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Kling AI ⚡</p>
                  <p className="text-xs text-muted-foreground">Fast • 1-5 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Gemini (Advanced)</p>
                  <p className="text-xs text-muted-foreground">Online • 1-5 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Omni-Image</p>
                  <p className="text-xs text-muted-foreground">Online • 1-5 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">All Services</p>
                  <p className="text-xs text-muted-foreground">100% Free • Fast</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
