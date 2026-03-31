import { useState } from 'react';
import { Home, User, Moon, Sun, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

export default function IOSControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* iOS-Style Menu Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Open Control Panel"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={togglePanel}
        />
      )}

      {/* iOS Control Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-white/20">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Control Panel</h3>
            <p className="text-xs text-muted-foreground">Quick Access Menu</p>
          </div>

          {/* Menu Grid */}
          <div className="space-y-3">
            {/* Home Button */}
            <button
              onClick={() => handleNavigation('/')}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Home</span>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Profile</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-200 dark:to-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-gray-800/20 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-white dark:text-gray-800" />
                  ) : (
                    <Sun className="w-5 h-5 text-white dark:text-gray-800" />
                  )}
                </div>
                <span className="text-sm font-medium text-white dark:text-gray-800">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-500' : 'bg-gray-400'
              }`}>
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Footer - Creator Credit */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-center text-muted-foreground">
              Created by <span className="font-semibold text-primary">Yasin (Munaf)</span>
            </p>
            <p className="text-xs text-center text-muted-foreground mt-1">
              100% Free • Lifetime Access
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
