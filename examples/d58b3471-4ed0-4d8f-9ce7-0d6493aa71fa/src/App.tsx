import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { TextEditor } from './components/TextEditor';
import { VoiceControls } from './components/VoiceControls';
import { AudioPlayer } from './components/AudioPlayer';
import { Language, Voice, VoiceSettings, AudioState } from './types';

// Get available voices from the browser
const getVoices = (): Language[] => {
  const voices = window.speechSynthesis.getVoices();
  
  // 查找中文声音
  const chineseMaleVoice = voices.find(v => v.lang.startsWith('zh') && !v.name.toLowerCase().includes('female'));
  const chineseFemaleVoice = voices.find(v => v.lang.startsWith('zh') && v.name.toLowerCase().includes('female'));
  
  // 查找英文声音
  const englishMaleVoice = voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('female'));
  const englishFemaleVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));

  // 如果没有找到合适的声音，使用第一个可用的声音
  const fallbackVoice = voices[0];

  // 生成唯一的ID
  const generateUniqueId = (prefix: string, voiceUri: string) => {
    return `${prefix}-${voiceUri}`;
  };

  return [
    {
      code: 'zh-CN',
      name: '中文',
      voices: [
        {
          id: generateUniqueId('zh-male', chineseMaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''),
          name: '男声',
          gender: 'male',
          voiceURI: chineseMaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''
        },
        {
          id: generateUniqueId('zh-female', chineseFemaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''),
          name: '女声',
          gender: 'female',
          voiceURI: chineseFemaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''
        }
      ]
    },
    {
      code: 'en-US',
      name: 'English',
      voices: [
        {
          id: generateUniqueId('en-male', englishMaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''),
          name: 'Male',
          gender: 'male',
          voiceURI: englishMaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''
        },
        {
          id: generateUniqueId('en-female', englishFemaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''),
          name: 'Female',
          gender: 'female',
          voiceURI: englishFemaleVoice?.voiceURI || fallbackVoice?.voiceURI || ''
        }
      ]
    }
  ];
};

const translateWithMyMemory = async (text: string, sourceLang: string, targetLang: string) => {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
    const data = await response.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

function App() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1,
    pitch: 1,
    volume: 0.8,
  });
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    progress: 0,
    duration: 0,
  });
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize voices
  useEffect(() => {
    const initVoices = () => {
      const availableLanguages = getVoices();
      setLanguages(availableLanguages);
      
      // 默认选择中文女声
      const chineseVoices = availableLanguages[0].voices;
      const femaleVoice = chineseVoices.find(v => v.gender === 'female');
      if (femaleVoice) {
        setSelectedVoice(femaleVoice.id);
      } else if (chineseVoices.length > 0) {
        setSelectedVoice(chineseVoices[0].id);
      }
    };

    // 确保voices已加载
    if (window.speechSynthesis.getVoices().length > 0) {
      initVoices();
    }
    
    window.speechSynthesis.addEventListener('voiceschanged', initVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', initVoices);
    };
  }, []);

  // 检测语言并翻译文本
  const translateText = async (text: string, targetLang: string) => {
    try {
      setIsTranslating(true);
      const sourceLang = detectLanguage(text);
      
      // 如果源语言和目标语言相同，不需要翻译
      if (sourceLang === targetLang) {
        setTranslatedText(text);
        return text;
      }

      // 转换语言代码格式
      const from = sourceLang === 'zh-CN' ? 'zh' : 'en';
      const to = targetLang === 'zh-CN' ? 'zh' : 'en';

      const translatedText = await translateWithMyMemory(text, from, to);
      setTranslatedText(translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      showToast('翻译失败');
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // 当语言改变时翻译文本
  useEffect(() => {
    if (text && selectedLanguage) {
      translateText(text, selectedLanguage);
    }
  }, [selectedLanguage, text]);

  // Auto-detect language when text changes
  useEffect(() => {
    if (autoDetectLanguage && text) {
      const detectedLang = detectLanguage(text);
      const matchingLang = languages.find(lang => lang.code.startsWith(detectedLang.split('-')[0]));
      
      if (matchingLang) {
        setSelectedLanguage(matchingLang.code);
        // 选择对应语言的女声
        const femaleVoice = matchingLang.voices.find(v => v.gender === 'female');
        if (femaleVoice) {
          setSelectedVoice(femaleVoice.id);
        } else if (matchingLang.voices.length > 0) {
          setSelectedVoice(matchingLang.voices[0].id);
        }
      }
    }
  }, [text, languages, autoDetectLanguage]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('tts-draft');
    if (savedDraft) {
      setText(savedDraft);
    }
  }, []);

  const handleClear = () => {
    setText('');
    setTranslatedText('');
    localStorage.removeItem('tts-draft');
    showToast('文本已清除');
  };

  const handleSaveDraft = () => {
    localStorage.setItem('tts-draft', text);
    showToast('草稿已保存');
  };

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const detectLanguage = (text: string): string => {
    try {
      const hasChineseChars = /[\u4E00-\u9FFF]/.test(text);
      if (hasChineseChars) return 'zh-CN';
      return 'en-US';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en-US';
    }
  };

  const startSpeech = () => {
    if (!text) {
      showToast('请输入文字');
      return;
    }

    // Stop any existing speech
    window.speechSynthesis.cancel();

    // Create new utterance with translated text
    const utterance = new SpeechSynthesisUtterance(translatedText || text);
    speechRef.current = utterance;

    // Set voice
    const voices = window.speechSynthesis.getVoices();
    const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
    const selectedVoiceObj = currentLanguage?.voices.find(v => v.id === selectedVoice);
    const systemVoice = voices.find(v => v.voiceURI === selectedVoiceObj?.voiceURI);
    
    if (systemVoice) {
      utterance.voice = systemVoice;
      utterance.lang = systemVoice.lang;
    }

    // Apply settings
    utterance.rate = voiceSettings.speed;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    // Set up event handlers
    utterance.onstart = () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        duration: text.length * 100,
      }));

      // Start progress tracking
      let progress = 0;
      intervalRef.current = window.setInterval(() => {
        progress += 100;
        setAudioState(prev => ({
          ...prev,
          progress: Math.min(progress, prev.duration),
        }));
      }, 100);
    };

    utterance.onend = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        progress: prev.duration,
      }));
    };

    utterance.onerror = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
      }));
      showToast('播放出错');
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (audioState.isPlaying) {
      window.speechSynthesis.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } else {
        startSpeech();
      }
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleDownload = async () => {
    if (!text) {
      showToast('请输入文字');
      return;
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      oscillator.connect(mediaStreamDestination);

      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'speech.wav';
        link.click();
        URL.revokeObjectURL(audioUrl);
      };

      mediaRecorder.start();
      startSpeech();

      speechRef.current!.onend = () => {
        mediaRecorder.stop();
        oscillator.stop();
      };

      oscillator.start();
    } catch (error) {
      showToast('下载出错');
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-600" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                          bg-gradient-to-r from-purple-600 to-blue-600">
              文字转语音
            </h1>
          </div>
          <p className="text-gray-600">将文字转换为自然的语音</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TextEditor
              text={text}
              translatedText={translatedText}
              isTranslating={isTranslating}
              onChange={setText}
              onClear={handleClear}
              onSaveDraft={handleSaveDraft}
            />
          </div>

          <div className="space-y-8">
            <VoiceControls
              languages={languages}
              selectedLanguage={selectedLanguage}
              selectedVoice={selectedVoice}
              settings={voiceSettings}
              onLanguageChange={setSelectedLanguage}
              onVoiceChange={setSelectedVoice}
              onSettingsChange={setVoiceSettings}
              autoDetectLanguage={autoDetectLanguage}
              onAutoDetectChange={setAutoDetectLanguage}
            />

            <AudioPlayer
              audioState={audioState}
              onPlay={handlePlay}
              onPause={handlePause}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;