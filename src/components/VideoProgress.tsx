import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VideoProgressProps {
  status: 'submitted' | 'processing' | 'succeed' | 'failed';
  taskId: string;
  onComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

export default function VideoProgress({ status, taskId, onComplete, onError }: VideoProgressProps) {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (status === 'processing') {
      // Simulate smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95; // Cap at 95% until actual completion
          return prev + Math.random() * 3;
        });
      }, 500);

      // Track elapsed time
      const timeInterval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(timeInterval);
      };
    } else if (status === 'succeed') {
      setProgress(100);
    } else if (status === 'submitted') {
      setProgress(10);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-blue-500" />,
          title: 'Queued',
          description: 'Your video is in the queue...',
          color: 'bg-blue-500',
        };
      case 'processing':
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-purple-500" />,
          title: 'Generating Video',
          description: 'AI is creating your video...',
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        };
      case 'succeed':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          title: 'Complete!',
          description: 'Your video is ready',
          color: 'bg-green-500',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          title: 'Failed',
          description: 'Video generation failed',
          color: 'bg-red-500',
        };
      default:
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-gray-500" />,
          title: 'Processing',
          description: 'Please wait...',
          color: 'bg-[#030508]0',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className="ios-card border-0 overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="ios-blur w-12 h-12 rounded-2xl flex items-center justify-center">
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{config.title}</h3>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
            {status === 'processing' && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                <div className="text-xs text-muted-foreground">{formatTime(elapsedTime)}</div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {(status === 'submitted' || status === 'processing') && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Task ID: {taskId.substring(0, 8)}...</span>
                <span>Est. 2-5 minutes</span>
              </div>
            </div>
          )}

          {/* Success/Failure Message */}
          {status === 'succeed' && (
            <div className="ios-blur rounded-xl p-4 border border-green-500/20 bg-green-500/5">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✨ Video generated successfully! Scroll down to view.
              </p>
            </div>
          )}

          {status === 'failed' && (
            <div className="ios-blur rounded-xl p-4 border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                ❌ Generation failed. Please try again with different settings.
              </p>
            </div>
          )}

          {/* Processing Steps */}
          {status === 'processing' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress > 20 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={progress > 20 ? 'text-foreground' : 'text-muted-foreground'}>
                  Analyzing prompt
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress > 40 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={progress > 40 ? 'text-foreground' : 'text-muted-foreground'}>
                  Generating frames
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress > 70 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={progress > 70 ? 'text-foreground' : 'text-muted-foreground'}>
                  Rendering video
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${progress > 90 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={progress > 90 ? 'text-foreground' : 'text-muted-foreground'}>
                  Finalizing
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
