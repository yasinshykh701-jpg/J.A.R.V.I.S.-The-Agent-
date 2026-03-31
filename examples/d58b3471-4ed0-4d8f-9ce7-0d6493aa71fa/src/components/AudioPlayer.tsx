import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { AudioState } from '../types';

type AudioPlayerProps = {
  audioState: AudioState;
  onPlay: () => void;
  onPause: () => void;
  onDownload: () => void;
};

export function AudioPlayer({ audioState, onPlay, onPause, onDownload }: AudioPlayerProps) {
  const { isPlaying, progress, duration } = audioState;

  return (
    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 
                     transition-colors duration-200 shadow-lg hover:shadow-xl 
                     transform hover:scale-105"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={onDownload}
          className="p-4 rounded-full bg-gray-100 text-purple-600 hover:bg-gray-200 
                     transition-colors duration-200"
          title="下载音频"
        >
          <Download size={24} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-200"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}