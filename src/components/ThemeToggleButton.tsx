import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative z-10 flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-full transition-all duration-300 hover:scale-110 shadow-lg bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alr1paguvm68.jpg)]"
      style={{
        background: 'linear-gradient(135deg, #00FFFF 0%, #87CEEB 50%, #1E90FF 100%)',
        color: '#000000',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="text-xs">Qazyen AI</span>
    </button>
  );
}
