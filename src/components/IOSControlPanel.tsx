import { useState } from 'react';
import { Home, User, X, Cpu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IOSControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { icon: Home,     label: 'Home',     path: '/',        color: '#00c8ff' },
    { icon: User,     label: 'Profile',  path: '/profile', color: '#a855f7' },
    { icon: Settings, label: 'Settings', path: '/settings',color: '#fbbf24' },
  ];

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open JARVIS Control Panel"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 p-3.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #00c8ff 0%, #0050a0 100%)',
          boxShadow: '0 0 20px rgba(0,200,255,0.5), 0 0 40px rgba(0,200,255,0.25)',
          border: '1px solid rgba(0,200,255,0.6)',
        }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Cpu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-72 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="rounded-2xl p-5 overflow-hidden relative"
          style={{
            background: '#00050f',
            border: '1px solid rgba(0,200,255,0.25)',
            boxShadow: '0 0 40px rgba(0,200,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,200,255,0.015) 3px, rgba(0,200,255,0.015) 6px)',
            }}
          />

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00c8ff60] rounded-tl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00c8ff60] rounded-br" />

          {/* Header */}
          <div className="relative mb-5">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00c8ff] animate-arc-pulse" />
              <h3 className="text-xs font-bold tracking-[0.25em] uppercase jarvis-gradient-text">
                Control Panel
              </h3>
            </div>
            <p className="text-[8px] tracking-[0.3em] text-[#00c8ff50] uppercase pl-3.5">
              Quick Navigation
            </p>
          </div>

          {/* Nav buttons */}
          <div className="relative space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                style={{
                  background: `${item.color}0a`,
                  border: `1px solid ${item.color}20`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${item.color}18`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${item.color}50`;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px ${item.color}25`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${item.color}0a`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${item.color}20`;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span
                  className="text-xs font-semibold tracking-[0.2em] uppercase"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="relative mt-5 pt-4 border-t border-[#00c8ff10] text-center">
            <p className="text-[8px] tracking-[0.35em] text-[#00c8ff40] uppercase">
              J.A.R.V.I.S · Created by Yasin
            </p>
            <p className="text-[8px] tracking-[0.25em] text-[#00c8ff30] uppercase mt-0.5">
              100% Free · Lifetime Access
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
