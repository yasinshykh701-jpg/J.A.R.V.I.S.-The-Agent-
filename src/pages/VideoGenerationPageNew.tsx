import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Video as VideoIcon, Upload, Download, Sparkles, X, CheckCircle, Play } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { 
  createSoraVideo, 
  querySoraVideo, 
  fileToBase64,
  type VideoGenerationRequest 
} from '@/services/aiServices';

export default function VideoGenerationPageNew() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'720x1280' | '1280x720'>('1280x720');
  const [duration, setDuration] = useState<4 | 8 | 12>(4);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp') {
      toast.error('Please upload PNG, JPEG, or WebP images only');
      return;
    }

    setReferenceImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setReferencePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    toast.success('Reference image uploaded');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }

    setIsLoading(true);
    setGeneratedVideo(null);
    setVideoId(null);
    setVideoStatus('');
    setProgress('Preparing request...');

    try {
      const request: VideoGenerationRequest = {
        prompt,
        size,
        seconds: duration,
      };

      // Add reference image if uploaded
      if (referenceImage && referencePreview) {
        setProgress('Processing reference image...');
        request.input_reference = referencePreview; // Base64 with data: prefix
        toast.info('Image-to-video mode activated');
      } else {
        toast.info('Text-to-video generation started');
      }

      // Submit video generation task
      setProgress('Submitting to Sora 2 AI...');
      const createResponse = await createSoraVideo(request);

      if (!createResponse.id) {
        throw new Error('Failed to create video task');
      }

      const newVideoId = createResponse.id;
      setVideoId(newVideoId);
      setVideoStatus(createResponse.status);
      setProgress('Video generation queued...');
      toast.success('Task submitted! Generating video with Sora 2...');

      // Poll for status every 10 seconds
      let attempts = 0;
      const maxAttempts = 120; // 20 minutes max (120 * 10 seconds)
      
      const pollStatus = async () => {
        attempts++;
        const elapsed = Math.floor(attempts * 10 / 60);
        const seconds = (attempts * 10) % 60;
        setProgress(`Generating... (${elapsed}m ${seconds}s)`);

        try {
          const statusResponse = await querySoraVideo(newVideoId);

          setVideoStatus(statusResponse.status);

          if (statusResponse.status === 'completed') {
            const videoUrl = statusResponse.output?.url;
            if (videoUrl) {
              setGeneratedVideo(videoUrl);
              setProgress('Complete!');
              toast.success('🎬 Video generated successfully!');
              setIsLoading(false);
              return;
            } else {
              throw new Error('No video URL in response');
            }
          } else if (statusResponse.status === 'failed') {
            throw new Error(statusResponse.error || 'Video generation failed');
          } else if (statusResponse.status === 'cancelled') {
            throw new Error('Video generation was cancelled');
          } else if (statusResponse.status === 'queued' || statusResponse.status === 'in_progress') {
            // Continue polling
            if (attempts >= maxAttempts) {
              throw new Error('Generation timeout - please try again');
            }
            setTimeout(pollStatus, 10000); // Poll every 10 seconds
          } else {
            throw new Error(`Unknown status: ${statusResponse.status}`);
          }
        } catch (error: any) {
          console.error('Polling error:', error);
          toast.error(error.message || 'Status check failed');
          setIsLoading(false);
          setProgress('Failed');
        }
      };

      // Start polling after 10 seconds
      setTimeout(pollStatus, 10000);

    } catch (error: any) {
      console.error('Video generation error:', error);
      toast.error(error.message || 'Failed to generate video');
      setIsLoading(false);
      setProgress('Error');
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `qazyen-video-${Date.now()}.mp4`;
      link.click();
      toast.success('Video download started!');
    }
  };

  const clearReference = () => {
    setReferenceImage(null);
    setReferencePreview(null);
    toast.info('Reference image cleared');
  };

  const examplePrompts = [
    'A cool cat riding a motorcycle through a neon-lit city at night',
    'Ocean waves crashing on a beach at sunset with seagulls flying',
    'A robot dancing in a futuristic laboratory with holographic displays',
    'Time-lapse of flowers blooming in a beautiful garden',
  ];

  return (
    <AppLayout>
      <BackToHome />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <VideoIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">AI Video Generation (Sora 2)</h1>
          </div>
          <p className="text-white/80">
            Create stunning videos with Sora 2 AI • 100% Free & Unlimited Forever
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Settings</CardTitle>
                <CardDescription>
                  Supports text-to-video and image-to-video generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <Label htmlFor="prompt">Video Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the video scene you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                {/* Example Prompts */}
                <div className="space-y-2">
                  <Label>Quick Examples</Label>
                  <div className="grid grid-cols-1 gap-2">
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

                {/* Size Selection */}
                <div className="space-y-2">
                  <Label htmlFor="size">Video Size</Label>
                  <Select value={size} onValueChange={(v) => setSize(v as '720x1280' | '1280x720')}>
                    <SelectTrigger id="size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1280x720">1280x720 (Landscape)</SelectItem>
                      <SelectItem value="720x1280">720x1280 (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v) as 4 | 8 | 12)}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 seconds</SelectItem>
                      <SelectItem value="8">8 seconds</SelectItem>
                      <SelectItem value="12">12 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reference Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="imageUpload">
                    Reference Image (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload First Frame
                    </Button>
                    {referenceImage && (
                      <Button variant="ghost" size="icon" onClick={clearReference}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image to anchor the first frame (720x1280 or 1280x720 only)
                  </p>
                </div>

                {/* Reference Preview */}
                {referencePreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={referencePreview}
                      alt="Reference"
                      className="w-full h-full object-cover"
                    />
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
                      Generate Video
                    </>
                  )}
                </Button>

                {videoId && (
                  <div className="space-y-1 text-xs text-muted-foreground text-center">
                    <div>Video ID: {videoId}</div>
                    <div>Status: {videoStatus}</div>
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
                  <span className="text-white">Sora 2 Video API: 100% Operational</span>
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
                <CardTitle>Generated Video</CardTitle>
                <CardDescription>
                  Your AI-generated video will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedVideo ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden border bg-black">
                      <video
                        src={generatedVideo}
                        controls
                        className="w-full h-full"
                        autoPlay
                        loop
                      >
                        Your browser does not support video playback.
                      </video>
                    </div>
                    <Button onClick={handleDownload} className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                    <div className="text-center p-6">
                      <VideoIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {isLoading ? 'Generating your video...' : 'Your generated video will appear here'}
                      </p>
                      {isLoading && (
                        <p className="text-xs text-muted-foreground mt-2">
                          This may take 2-5 minutes depending on duration
                        </p>
                      )}
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
