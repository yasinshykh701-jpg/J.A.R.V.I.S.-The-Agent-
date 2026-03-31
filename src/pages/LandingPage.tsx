import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ChevronRight, Bot, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/home', { replace: true });
      } else {
        setShowContent(true);
      }
    }
  }, [user, loading, navigate]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white/80">Experience the future of AI</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Meet Qazyen AI.
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-12 font-medium leading-relaxed">
            Your personal 3D AI companion for generation, analysis, and intelligent conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button 
              onClick={() => navigate('/register')}
              size="lg" 
              className="ios-button h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(0,122,255,0.4)]"
            >
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              size="lg" 
              className="ios-button h-14 px-10 text-lg border-white/10 bg-white/5 hover:bg-white/10"
            >
              Log In
            </Button>
          </div>

          {/* 3D Robot Showcase */}
          <div className="w-full h-[500px] relative mt-10">
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-white/60">3D Robot Preview</p>
                  </div>
                </div>
              }
            >
              <TitanRobotAdvanced isListening={true} emotion="happy" />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover-lift transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3D Virtual Assistant</h3>
              <p className="text-white/60 leading-relaxed">
                Interact with Qazyen AI, our realistic 3D robot that understands voice and gestures.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover-lift transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Generation</h3>
              <p className="text-white/60 leading-relaxed">
                Generate high-quality images and videos from simple text prompts in seconds.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover-lift transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-white/60 leading-relaxed">
                Your data is never stored permanently. Everything is cleared once you close the app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">Q</div>
            <span className="font-bold">Qazyen AI</span>
          </div>
          <p className="text-sm text-white/40 font-medium">
            Presented By: Y A S I N | 2026 Qazyen AI
          </p>
        </div>
      </footer>
    </div>
  );
}
