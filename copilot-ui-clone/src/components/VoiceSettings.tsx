import { Check } from 'lucide-react';

export const GEMINI_VOICES = [
  { id: 'Puck', name: 'Puck', desc: 'Energetic & Cheerful (Male, Multilingual)', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir', desc: 'Deep, Resonant & Powerful (Male, Multilingual)', gender: 'Male' },
  { id: 'Kore', name: 'Kore', desc: 'Clear, Natural & Balanced (Female, Multilingual)', gender: 'Female' },
  { id: 'Charon', name: 'Charon', desc: 'Deep & Authoritative (Male, Multilingual)', gender: 'Male' },
  { id: 'Zephyr', name: 'Zephyr', desc: 'Calm & Friendly (Male, Multilingual)', gender: 'Male' },
  { id: 'Aoede', name: 'Aoede', desc: 'Expressive & Melodic (Female, Multilingual)', gender: 'Female' },
  { id: 'hi-IN-Standard-A', name: 'Aarav (Hindi)', desc: 'Natural Hindi Voice (Male)', gender: 'Male' },
  { id: 'hi-IN-Standard-D', name: 'Diya (Hindi)', desc: 'Natural Hindi Voice (Female)', gender: 'Female' }
];

interface VoiceSettingsProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  onBack: () => void;
}

export function VoiceSettings({ selectedVoice, onSelectVoice, onBack }: VoiceSettingsProps) {
  return (
    <div className="py-1 min-w-[220px]">
      <div className="px-3 py-2 border-b border-ink-faint flex items-center gap-2 mb-1">
        <button onClick={onBack} className="text-neutral-500 hover:text-ink transition-colors text-xs font-bold px-1.5 py-0.5 rounded bg-bg cursor-pointer">
          &larr; Back
        </button>
        <span className="text-xs font-bold text-ink">Voice Selection</span>
      </div>
      <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto no-scrollbar px-1 pb-1">
        {GEMINI_VOICES.map(voice => (
          <button 
            key={voice.id}
            onClick={() => onSelectVoice(voice.id)}
            className={`flex flex-col text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${selectedVoice === voice.id ? 'bg-accent/10 border-accent/20 border' : 'hover:bg-bg border border-transparent'}`}
          >
            <div className="flex items-center justify-between w-full">
              <span className={`text-xs font-bold ${selectedVoice === voice.id ? 'text-accent' : 'text-neutral-600'}`}>
                {voice.name}
              </span>
              {selectedVoice === voice.id && <Check size={14} className="text-accent" />}
            </div>
            <span className="text-[10px] text-neutral-400 mt-0.5">{voice.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
