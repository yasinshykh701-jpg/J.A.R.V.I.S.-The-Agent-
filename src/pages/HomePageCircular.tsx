import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Moon,
  Sun,
  Grid3x3,
  Circle,
  Shield,
  Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CircularMenu from '@/components/CircularMenu';
import GridMenu from '@/components/GridMenu';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useTheme } from '@/components/theme-provider';

export default function HomePageCircular() {
  const [viewMode, setViewMode] = useState<'circular' | 'grid'>('circular');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-amjov9q83if4.jpg)]">
      {/* Animated Gradient Motion Background */}
      {/* Video Background (Optional - can be enabled with uploaded video) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        style={{ mixBlendMode: 'overlay' }}
      >
        {/* Video source can be added here */}
      </video>
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-2 pb-6 border-none border-[50px] border-[transparent00] mr-[400px] ml-[400px] bg-cover bg-center bg-no-repeat rounded-[9px] bg-[#00000003] bg-none">
        <div className="flex items-center justify-end mb-4 mt-2 border-solid rounded-[20px] border-[5px] border-[rgb(218,231,231)] ml-[400px] mr-[400px] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-akvt7t91jjsw.png)]">
          <div className="flex-1" />
          <div>
            <h1 className="text-4xl font-bold drop-shadow-lg text-center text-white">
              Qazyen AI
            </h1>
            <p className="text-sm mt-1 text-center text-white/90">
              100% Free Forever • Created by Yasin (Munaf)
            </p>
          </div>
          
          <div className="flex items-center gap-3 border-solid border-[rgb(218,231,231)] border-[0px] border-[rgb(218,231,231)]">
            {/* Background Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/background-settings')}
              className="rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
              title="Background Settings"
            >
              <Palette className="h-5 w-5" />
            </Button>
            
            {/* Admin Mode Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin-settings')}
              className="rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
              title="Admin Settings"
            >
              <Shield className="h-5 w-5" />
            </Button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full p-1">
              <Button
                variant={viewMode === 'circular' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('circular')}
                className={`rounded-full text-white ${viewMode === 'circular' ? 'bg-white dark:bg-black text-primary' : 'hover:bg-white/20'}`}
              >
                <Circle className="w-4 h-4 mr-2" />
                Circular
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-full text-white ${viewMode === 'grid' ? 'bg-white dark:bg-black text-primary' : 'hover:bg-white/20'}`}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Robot Display on Home Page */}
        {viewMode === 'circular' && (
          <div className="mb-8 flex justify-center rounded-[20px] ml-[400px] mr-[400px] border-solid border-[5px] border-[#0b9eeb] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alqkw7nne7eo.jpg)]">
            <div className="w-full max-w-md h-[300px] bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 dark:border-black/20">
              <ErrorBoundary
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <p className={theme === 'dark' ? 'text-white' : 'text-black'}>Titan Robot</p>
                    </div>
                  </div>
                }
              >
                <TitanRobotAdvanced isListening={false} emotion="neutral" />
              </ErrorBoundary>
            </div>
          </div>
        )}
        
        {/* Conditional rendering based on view mode */}
        {viewMode === 'circular' ? (
          <CircularMenu />
        ) : (
          <GridMenu />
        )}
      </div>
      {/* Samsung Z Fold Fold Line Effect */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none z-50 hidden md:block" />
    </div>
  );
}
