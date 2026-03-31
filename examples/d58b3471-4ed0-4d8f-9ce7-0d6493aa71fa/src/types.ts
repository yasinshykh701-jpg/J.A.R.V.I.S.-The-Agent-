export type Language = {
  code: string;
  name: string;
  voices: Voice[];
};

export type Voice = {
  id: string;
  name: string;
  gender: 'male' | 'female';
  voiceURI: string;
};

export type VoiceSettings = {
  speed: number;
  pitch: number;
  volume: number;
};

export type AudioState = {
  isPlaying: boolean;
  progress: number;
  duration: number;
};