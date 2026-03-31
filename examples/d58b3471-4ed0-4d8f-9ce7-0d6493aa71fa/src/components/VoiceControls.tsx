import React from 'react';
import { Volume2, Mic2, Languages } from 'lucide-react';
import { Language, Voice, VoiceSettings } from '../types';

type VoiceControlsProps = {
  languages: Language[];
  selectedLanguage: string;
  selectedVoice: string;
  settings: VoiceSettings;
  onLanguageChange: (code: string) => void;
  onVoiceChange: (id: string) => void;
  onSettingsChange: (settings: VoiceSettings) => void;
  autoDetectLanguage: boolean;
  onAutoDetectChange: (enabled: boolean) => void;
};

export function VoiceControls({
  languages,
  selectedLanguage,
  selectedVoice,
  settings,
  onLanguageChange,
  onVoiceChange,
  onSettingsChange,
}: VoiceControlsProps) {
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="space-y-6 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-600">
          <Languages size={20} />
          <h3 className="font-medium">语言</h3>
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full p-2 rounded-lg border border-purple-100 focus:border-purple-300 
                     focus:ring-2 focus:ring-purple-200 outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-600">
          <Mic2 size={20} />
          <h3 className="font-medium">声音</h3>
        </div>
        <select
          value={selectedVoice}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="w-full p-2 rounded-lg border border-purple-100 focus:border-purple-300 
                     focus:ring-2 focus:ring-purple-200 outline-none"
        >
          {currentLanguage?.voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-600">
          <Volume2 size={20} />
          <h3 className="font-medium">设置</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">语速</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.speed}
              onChange={(e) => onSettingsChange({ ...settings, speed: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>慢</span>
              <span>快</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">音调</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.pitch}
              onChange={(e) => onSettingsChange({ ...settings, pitch: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>低</span>
              <span>高</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">音量</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => onSettingsChange({ ...settings, volume: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>小</span>
              <span>大</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}