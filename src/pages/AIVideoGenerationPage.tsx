import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Loader2, Download, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { supabase } from '@/services/aiServices';

export default function AIVideoGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [generationMode, setGenerationMode] = useState<'text' | 'image'>('text');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pollTaskStatus = async (id: string) => {
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        // Use different query function based on generation mode
        const queryFunction = generationMode === 'image' ? 'image2video-query' : 'omni-video-query';
        
        const { data, error } = await supabase.functions.invoke(queryFunction, {
          body: { task_id: id }
        });

        if (error) {
          console.error('Query error:', error);
          throw error;
        }

        const taskStatus = data?.data?.task_status;
        const taskResult = data?.data?.task_result;

        setProgress(Math.min(95, (attempts / maxAttempts) * 100));

        if (taskStatus === 'succeed' && taskResult?.videos?.[0]?.url) {
          setVideoUrl(taskResult.videos[0].url);
          setStatus('completed');
          setProgress(100);
          toast.success('Video generated successfully! ⚡');
          return;
        }

        if (taskStatus === 'failed') {
          setStatus('failed');
          toast.error('Video generation failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts && (taskStatus === 'submitted' || taskStatus === 'processing')) {
          setTimeout(poll, 5000); // Poll every 5 seconds for faster updates
        } else if (attempts >= maxAttempts) {
          setStatus('failed');
          toast.error('Video generation timeout');
        }
      } catch (err) {
        console.error('Poll error:', err);
        setStatus('failed');
        toast.error('Failed to check video status');
      }
    };

    poll();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG images are supported');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setReferenceImage(base64);
        setGenerationMode('image');
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    setGenerationMode('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && generationMode === 'text') {
      toast.error('Please enter a video description');
      return;
    }

    if (generationMode === 'image' && !referenceImage) {
      toast.error('Please upload an image');
      return;
    }

    setIsGenerating(true);
    setStatus('generating');
    setProgress(0);
    setVideoUrl(null);

    try {
      if (generationMode === 'image') {
        // Use image-to-video API
        const { data, error } = await supabase.functions.invoke('image2video-create', {
          body: {
            image: referenceImage,
            prompt: prompt || '',
            duration,
            model_name: 'kling-v2-1'
          }
        });

        if (error) {
          throw error;
        }

        if (data?.data?.task_id) {
          setTaskId(data.data.task_id);
          toast.success('Image-to-video generation started! ⚡ Fast processing');
          pollTaskStatus(data.data.task_id);
        } else {
          throw new Error('No task ID received');
        }
      } else {
        // Use text-to-video API (existing)
        const { data, error } = await supabase.functions.invoke('omni-video-create', {
          body: {
            prompt,
            duration,
            aspect_ratio: aspectRatio,
            mode: 'pro'
          }
        });

        if (error) {
          throw error;
        }

        if (data?.data?.task_id) {
          setTaskId(data.data.task_id);
          toast.success('Video generation started! ⚡ Fast processing');
          pollTaskStatus(data.data.task_id);
        } else {
          throw new Error('No task ID received');
        }
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setStatus('failed');
      toast.error(error.message || 'Failed to start video generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `JARVIS-video-${Date.now()}.mp4`;
      link.click();
      toast.success('Video download started');
    }
  };

  return (
    <AppLayout>
      <BackToHome />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">AI Video Generation</h1>
          </div>
          <p className="text-white/80">
            Generate videos from text or images with Kling AI • 100% Free Forever • ⚡ Fast (1-5 min)
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Online • Lifetime Free
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
              ⚡ Fast Generation (1-5 min)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
              <CardDescription>
                {generationMode === 'text' 
                  ? 'Configure your text-to-video generation parameters'
                  : 'Configure your image-to-video generation parameters'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generation Mode Tabs */}
              <Tabs value={generationMode} onValueChange={(v) => setGenerationMode(v as 'text' | 'image')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Text to Video</TabsTrigger>
                  <TabsTrigger value="image">Image to Video</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Image Upload Section (only for image mode) */}
              {generationMode === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Reference Image *</Label>
                  <div className="flex flex-col gap-2">
                    {!referenceImage ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="image-upload"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image (JPG, PNG - Max 10MB)
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={referenceImage}
                          alt="Reference"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload an image to animate. Minimum 300px, aspect ratio 1:2.5 to 2.5:1
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="prompt">
                  {generationMode === 'text' ? 'Video Description *' : 'Animation Description (Optional)'}
                </Label>
                <Textarea
                  id="prompt"
                  placeholder={
                    generationMode === 'text'
                      ? "Describe the video you want to generate... (e.g., 'A cat playing with a ball in a sunny garden')"
                      : "Describe how you want the image to be animated... (e.g., 'Make the person wave at the camera')"
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Video Duration (seconds)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="6">6 seconds</SelectItem>
                      <SelectItem value="7">7 seconds</SelectItem>
                      <SelectItem value="8">8 seconds</SelectItem>
                      <SelectItem value="9">9 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Length of generated video</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspectRatio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                      <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || status === 'generating'}
                className="w-full"
                size="lg"
              >
                {isGenerating || status === 'generating' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Generate Video
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
                    Generation time: 1-5 minutes. Please wait...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Video</CardTitle>
              <CardDescription>Your AI-generated video will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Video className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter a description and click "Generate Video" to start
                  </p>
                </div>
              )}

              {status === 'generating' && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                  <p className="text-foreground font-medium mb-2">Generating your video...</p>
                  <p className="text-sm text-muted-foreground">
                    ⚡ Generation time: 1-5 minutes
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

              {status === 'completed' && videoUrl && (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <Button onClick={handleDownload} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">Online & Operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Cost</p>
                  <p className="text-xs text-muted-foreground">100% Free Forever</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Service</p>
                  <p className="text-xs text-muted-foreground">
                    {generationMode === 'text' ? 'Kling AI Omni-Video • Fast' : 'Kling AI Image2Video • Fast'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
