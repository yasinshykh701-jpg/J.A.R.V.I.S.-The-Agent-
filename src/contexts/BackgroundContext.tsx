import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundSettings {
  type: 'gradient' | 'image' | 'solid';
  customImage?: string;
  gradientEnabled: boolean;
  gradientOpacity: number;
  solidColor?: string;
}

interface BackgroundContextType {
  settings: BackgroundSettings;
  updateSettings: (settings: Partial<BackgroundSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: BackgroundSettings = {
  type: 'gradient',
  gradientEnabled: true,
  gradientOpacity: 100,
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BackgroundSettings>(() => {
    const saved = localStorage.getItem('JARVIS-background-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('JARVIS-background-settings', JSON.stringify(settings));
    
    // Apply background to body
    const body = document.body;
    body.style.transition = 'background 0.3s ease';
    
    if (settings.type === 'image' && settings.customImage) {
      body.style.backgroundImage = `url(${settings.customImage})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
    } else if (settings.type === 'solid' && settings.solidColor) {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = settings.solidColor;
    } else {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '';
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<BackgroundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '';
  };

  return (
    <BackgroundContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider');
  }
  return context;
}
