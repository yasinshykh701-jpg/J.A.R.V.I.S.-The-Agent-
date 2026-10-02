/**
 * J.A.R.V.I.S — Floating Dark / Light Mode Toggle
 * Fixed bottom-left, pill style, smooth transition
 */
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full
        transition-all duration-300 hover:scale-105 active:scale-95 select-none"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(0,8,20,0.98) 100%)'
          : 'rgba(255,255,255,0.85)',
        border: isDark
          ? '1px solid rgba(0,200,255,0.35)'
          : '1px solid rgba(0,0,0,0.12)',
        boxShadow: isDark
          ? '0 0 16px rgba(0,200,255,0.25), 0 4px 20px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#fbbf24' }}>
            Light
          </span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" style={{ color: '#3b82f6' }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#3b82f6' }}>
            Dark
          </span>
        </>
      )}
    </button>
  );
}
