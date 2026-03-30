import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Scissors, 
  Download, 
  Upload, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Sparkles,
  Film,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';

export default function VideoEditorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState([80]);
  const [trimStart, setTrimStart] = useState([0]);
  const [trimEnd, setTrimEnd] = useState([100]);
  const [filter, setFilter] = useState('none');
  const [speed, setSpeed] = useState('1.0');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        toast.success(`Video loaded: ${file.name}`);
      } else {
        toast.error('Please upload a valid video file');
      }
    }
  };

  const handleExport = () => {
    if (!videoFile) {
      toast.error('Please upload a video first');
      return;
    }
    toast.success('Exporting video... (Feature coming soon)');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="ios-blur border-b border-border/50 ios-shadow z-10 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alsb4r73w1s0.jpg)]">
          <div className="content-column py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Scissors className="w-6 h-6 text-primary" />
                Video Editor
              </h1>
              <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wider">
                Professional Video Editing Studio
              </p>
            </div>
            <Button
              onClick={handleExport}
              className="ios-button bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!videoFile}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Video
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alsac971bim8.jpg)]">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload Section */}
            {!videoFile ? (
              <Card className="ios-card bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-af619u2sb7r4.jpg)]">
                <CardContent className="p-12 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-af5zip36kphc.jpg)] rounded-[20px]">
                  <div className="flex flex-col items-center justify-center space-y-4 bg-cover bg-center bg-no-repeat bg-[#14141400] bg-none">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-af604mbjmnls.jpg)]">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Upload Your Video</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop or click to browse
                      </p>
                    </div>
                    <label htmlFor="video-upload">
                      <Button asChild className="ios-button">
                        <span
                          className="bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-af5zwq73eku8.jpg)]">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Video File
                        </span>
                      </Button>
                    </label>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: MP4, MOV, AVI, WebM
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Video Preview */}
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      Video Preview
                    </CardTitle>
                    <CardDescription>
                      {videoFile.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Video Preview</p>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          size="icon"
                          variant="outline"
                          className="ios-button"
                        >
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={togglePlayPause}
                          className="ios-button w-12 h-12"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="ios-button"
                        >
                          <SkipForward className="w-4 h-4" />
                        </Button>

                        <div className="flex-1">
                          <Slider
                            value={[currentTime]}
                            onValueChange={(value) => setCurrentTime(value[0])}
                            max={duration}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-32">
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Editing Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trim Tool */}
                  <Card className="ios-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-primary" />
                        Trim Video
                      </CardTitle>
                      <CardDescription>
                        Set start and end points
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Slider
                          value={trimStart}
                          onValueChange={setTrimStart}
                          max={duration}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          {trimStart[0]}s
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Slider
                          value={trimEnd}
                          onValueChange={setTrimEnd}
                          max={duration}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          {trimEnd[0]}s
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Effects */}
                  <Card className="ios-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-primary" />
                        Effects & Filters
                      </CardTitle>
                      <CardDescription>
                        Apply visual effects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter">Filter</Label>
                        <Select value={filter} onValueChange={setFilter}>
                          <SelectTrigger id="filter" className="ios-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="grayscale">Grayscale</SelectItem>
                            <SelectItem value="sepia">Sepia</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="bright">Bright</SelectItem>
                            <SelectItem value="contrast">High Contrast</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="speed">Playback Speed</Label>
                        <Select value={speed} onValueChange={setSpeed}>
                          <SelectTrigger id="speed" className="ios-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                            <SelectItem value="0.75">0.75x</SelectItem>
                            <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                            <SelectItem value="1.25">1.25x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2.0">2.0x (Fast)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Enhancement */}
                <Card className="ios-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Enhancement
                    </CardTitle>
                    <CardDescription>
                      Enhance your video with AI-powered tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" className="ios-button">
                        Auto Enhance
                      </Button>
                      <Button variant="outline" className="ios-button">
                        Stabilize
                      </Button>
                      <Button variant="outline" className="ios-button">
                        Denoise
                      </Button>
                      <Button variant="outline" className="ios-button">
                        Upscale
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
