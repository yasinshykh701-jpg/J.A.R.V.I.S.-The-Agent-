import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Video, Upload, Loader2, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import VideoProgress from '@/components/VideoProgress';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import BackToHome from '@/components/BackToHome';

interface VideoTask {
  task_id: string;
  task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
  video_url?: string;
}

export default function VideoGenerationPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5');
  const [modelName, setModelName] = useState('kling-v2-5-turbo');
  const [mode, setMode] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<VideoTask | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '9:16', label: '9:16 (Portrait)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '4:3', label: '4:3 (Standard)' },
    { value: '3:2', label: '3:2 (Photo)' },
    { value: '21:9', label: '21:9 (Cinematic)' },
  ];

  const models = [
    { value: 'kling-v2-5-turbo', label: 'Kling V2.5 Turbo (Fast)' },
    { value: 'kling-v2-1-master', label: 'Kling V2.1 Master (Quality)' },
    { value: 'kling-v2-master', label: 'Kling V2 Master (Balanced)' },
    { value: 'kling-v1-6', label: 'Kling V1.6 (Stable)' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      toast.success('✅ Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const pollVideoStatus = async (taskId: string) => {
    const maxAttempts = 120; // 10 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('query-video-status', {
          body: { task_id: taskId }
        });

        if (error) {
          const errorMsg = await error?.context?.text();
          console.error('Query error:', errorMsg || error.message);
          throw new Error(errorMsg || error.message);
        }

        console.log('Video status poll:', data);

        const taskStatus = data?.data?.task_status;
        const taskStatusMsg = data?.data?.task_status_msg;

        // Update current task status
        setCurrentTask((prev) => prev ? { ...prev, task_status: taskStatus } : null);

        if (taskStatus === 'succeed') {
          const videoUrl = data.data.task_result?.videos?.[0]?.url;
          if (videoUrl) {
            setGeneratedVideo(videoUrl);
            setCurrentTask(null);
            setIsGenerating(false);
            toast.success('🎉 Video generated successfully!');
            
            // Save to database
            if (user) {
              await supabase.from('generated_media').insert({
                user_id: user.id,
                media_type: 'video',
                prompt,
                media_url: videoUrl,
                settings: {
                  aspect_ratio: aspectRatio,
                  duration,
                  model_name: modelName,
                  mode
                }
              });
            }
            return;
          }
        } else if (taskStatus === 'failed') {
          setCurrentTask((prev) => prev ? { ...prev, task_status: 'failed' } : null);
          setIsGenerating(false);
          toast.error(`❌ Video generation failed: ${taskStatusMsg || 'Unknown error'}`);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          setIsGenerating(false);
          setCurrentTask(null);
          toast.error('⏱️ Video generation timeout. Please try again.');
        }
      } catch (error: any) {
        console.error('Poll error:', error);
        setIsGenerating(false);
        setCurrentTask((prev) => prev ? { ...prev, task_status: 'failed' } : null);
        toast.error(`❌ ${error.message || 'Failed to check video status'}`);
      }
    };

    poll();
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && mode === 'text') {
      toast.error('⚠️ Please enter a prompt');
      return;
    }

    if (mode === 'image' && !uploadedImage) {
      toast.error('⚠️ Please upload an image');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);
    setCurrentTask(null);

    try {
      let response;

      if (mode === 'text') {
        response = await supabase.functions.invoke('text-to-video', {
          body: {
            prompt,
            negative_prompt: negativePrompt || undefined,
            model_name: modelName,
            aspect_ratio: aspectRatio,
            duration
          }
        });
      } else {
        // Clean base64 image
        let cleanImage = uploadedImage!;
        if (cleanImage.includes('base64,')) {
          cleanImage = cleanImage.split('base64,')[1];
        }

        response = await supabase.functions.invoke('image-to-video', {
          body: {
            image: cleanImage,
            prompt: prompt || undefined,
            negative_prompt: negativePrompt || undefined,
            mode: 'pro',
            duration
          }
        });
      }

      if (response.error) {
        const errorMsg = await response.error?.context?.text();
        console.error('Generation error:', errorMsg || response.error.message);
        throw new Error(errorMsg || response.error.message);
      }

      const taskId = response.data?.data?.task_id;
      if (!taskId) {
        throw new Error('No task ID received from API');
      }

      setCurrentTask({ 
        task_id: taskId, 
        task_status: 'submitted' 
      });
      
      toast.success('🚀 Video generation started!');
      
      // Start polling
      pollVideoStatus(taskId);
    } catch (error: any) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      toast.error(`❌ ${error.message || 'Failed to generate video'}`);
    }
  };

  const handleDownload = () => {
    if (!generatedVideo) return;
    
    const a = document.createElement('a');
    a.href = generatedVideo;
    a.download = `qazyen-video-${Date.now()}.mp4`;
    a.click();
    toast.success('⬇️ Video download started!');
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        {/* Header */}
        <div className="ios-blur ios-shadow border-solid border-[18.3784px] rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[12px] rounded-br-[12px] border-[#f2f8f2e6] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsnnj0xj1mo.jpg)]">
          <div className="content-column py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl from-purple-500 to-pink-500 flex items-center justify-center ios-shadow bg-cover bg-center bg-no-repeat bg-[#211d1c]">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-[#f4f0f0]">AI Video Generation</h1>
                <p className="text-sm text-[#f3f2f2]">Create stunning videos with advanced AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-a1chw19mbj7k.png)]">
          <div className="content-column space-y-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsn2hd29ssg.jpg)] rounded-[20px]">
            {/* Mode Selection */}
            <Card className="ios-card border-0 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsoyfzdxu68.jpg)]">
              <CardHeader>
                <CardTitle>Generation Mode</CardTitle>
                <CardDescription>Choose how you want to create your video</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={mode === 'text' ? 'default' : 'outline'}
                    onClick={() => setMode('text')}
                    className="h-20 flex-col gap-2 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsmeszpmg3k.jpg)]"
                    disabled={isGenerating}
                  >
                    <Sparkles className="h-6 w-6" />
                    <span>Text to Video</span>
                  </Button>
                  <Button
                    variant={mode === 'image' ? 'default' : 'outline'}
                    onClick={() => setMode('image')}
                    className="h-20 flex-col gap-2"
                    disabled={isGenerating}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Image to Video</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload (if image mode) */}
            {mode === 'image' && (
              <Card className="ios-card border-0">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Upload an image to animate (Max 10MB)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    disabled={isGenerating}
                  >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded" className="max-h-28 rounded-lg object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8" />
                        <span>Click to upload image</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Settings Card */}
            <Card className="ios-card border-0 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsokevh3m68.jpg)]">
              <CardHeader
                className="bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agtgx5j2tibk.jpg)]">
                <CardTitle className="text-[13px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agtnwtx01zwg.jpg)] rounded-[20px]">{"Video Settings"}</CardTitle>
                <CardDescription>Configure your video generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agtv3iuvomps.jpg)] rounded-[20px] border-[5px] border-solid border-[rgb(218,231,231)]">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select value={modelName} onValueChange={setModelName} disabled={isGenerating}>
                      <SelectTrigger className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                      <SelectTrigger className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
                      <SelectTrigger className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <Textarea
                    placeholder="Describe the video you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="ios-input min-h-[100px] resize-none bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsmsu3mghs0.jpg)]"
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Negative Prompt (Optional)</Label>
                  <Textarea
                    placeholder="What you don't want in the video..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="ios-input min-h-[80px] resize-none bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agtf54yz9lhc.jpg)]"
                    disabled={isGenerating}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full ios-button gap-2 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agtg9wxz2rr4.jpg)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      Generate Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* iOS-Style Progress */}
            {currentTask && (
              <VideoProgress
                status={currentTask.task_status}
                taskId={currentTask.task_id}
              />
            )}

            {/* Result Card */}
            {generatedVideo && (
              <Card className="ios-card border-0 animate-in fade-in slide-in-from-bottom duration-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Video</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full rounded-2xl ios-shadow"
                    autoPlay
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
