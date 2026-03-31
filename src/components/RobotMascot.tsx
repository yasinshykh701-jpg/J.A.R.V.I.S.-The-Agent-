import { useEffect, useState } from 'react';
import { Bot, Zap, Radio, Cpu } from 'lucide-react';

export default function RobotMascot() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [eyeState, setEyeState] = useState(true);

  useEffect(() => {
    // Floating animation trigger
    const floatInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);

    // Eye blink animation
    const blinkInterval = setInterval(() => {
      setEyeState(false);
      setTimeout(() => setEyeState(true), 200);
    }, 3000);

    return () => {
      clearInterval(floatInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none select-none">
      <div className={`relative transition-transform duration-500 ${isAnimating ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`}>
        {/* Robot Container with 3D Effect */}
        <div className="relative w-40 h-48 animate-float">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          
          {/* Robot Body */}
          <div className="relative w-full h-full">
            {/* Antenna */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-full" />
              <div className="w-3 h-3 bg-primary rounded-full animate-ping shadow-lg shadow-primary/50" />
              <div className="absolute top-6 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
            </div>
            
            {/* Head */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24">
              <div className="w-full h-full bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 rounded-3xl shadow-2xl border-2 border-zinc-600 relative overflow-hidden robot-card">
                {/* Circuit Pattern on head */}
                <div className="absolute inset-0 circuit-pattern opacity-20" />
                
                {/* Top panel */}
                <div className="absolute top-2 left-2 right-2 h-3 bg-zinc-700/50 rounded-lg border border-zinc-600" />
                
                {/* Eyes */}
                <div className={`absolute top-10 left-4 w-4 h-4 rounded-full shadow-lg transition-all duration-200 ${
                  eyeState ? 'bg-primary shadow-primary/50 scale-100' : 'bg-primary/30 scale-y-10'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-full" />
                </div>
                <div className={`absolute top-10 right-4 w-4 h-4 rounded-full shadow-lg transition-all duration-200 ${
                  eyeState ? 'bg-primary shadow-primary/50 scale-100' : 'bg-primary/30 scale-y-10'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-full" />
                </div>
                
                {/* Mouth/Display */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary/50 rounded-full">
                  <div className="absolute inset-0 flex gap-1 items-center justify-center">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
                
                {/* Face visor shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl" />
              </div>
            </div>
            
            {/* Neck */}
            <div className="absolute top-28 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-lg border border-zinc-700" />
            
            {/* Body */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-28 h-20">
              <div className="w-full h-full bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-600 rounded-2xl shadow-2xl border-2 border-zinc-700 relative overflow-hidden robot-card">
                {/* Chest Panel */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-12 bg-zinc-800/50 rounded-xl border border-zinc-600 metallic-panel">
                  {/* Power indicators */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50" style={{ animationDelay: '0.5s' }} />
                  </div>
                  
                  {/* Core display */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-primary/30 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Bolts */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-zinc-900 rounded-full border border-zinc-700" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-zinc-900 rounded-full border border-zinc-700" />
                <div className="absolute bottom-1 left-1 w-2 h-2 bg-zinc-900 rounded-full border border-zinc-700" />
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-zinc-900 rounded-full border border-zinc-700" />
                
                {/* Metallic shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="absolute top-6 -right-3 flex flex-col gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-primary shadow-lg robot-card pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-accent shadow-lg robot-card pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
              <Radio className="w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-green-500 shadow-lg robot-card pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4 text-green-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
          
          {/* Robot Icon Badge */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary via-primary to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-3 border-zinc-800 robot-card">
            <Bot className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>
        
        {/* Name Tag */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="bg-zinc-900/95 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-primary/50 shadow-2xl robot-card">
            <p className="text-sm font-bold text-primary tracking-wider holographic-text">QAZYEN</p>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-1/4 right-0 w-2 h-2 bg-accent/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }} />
        </div>
      </div>
    </div>
  );
}
