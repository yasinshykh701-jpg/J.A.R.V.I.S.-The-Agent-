import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackToHomeProps {
  className?: string;
}

export default function BackToHome({ className = '' }: BackToHomeProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/')}
      variant="ghost"
      size="sm"
      className={`fixed top-4 left-4 z-50 backdrop-blur-md bg-background/80 hover:bg-background/90 border border-border/50 shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(135, 206, 235, 0.1) 50%, rgba(30, 144, 255, 0.1) 100%)',
      }}
    >
      <Home className="h-4 w-4 mr-2" />
      <span className="font-medium bg-cover bg-center bg-no-repeat text-[16px] bg-[#0c0a0a00] bg-none text-[#140404]">Home</span>
    </Button>
  );
}
