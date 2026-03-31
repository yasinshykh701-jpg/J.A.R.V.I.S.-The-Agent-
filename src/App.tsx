import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { ChatHistoryProvider } from '@/contexts/ChatHistoryContext';
import { BackgroundProvider } from '@/contexts/BackgroundContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from 'sonner';
import ThemeToggleButton from '@/components/ThemeToggleButton';

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <BackgroundProvider>
          <AuthProvider>
            <ChatHistoryProvider>
              <RouteGuard>
                <IntersectObserver />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {routes.map((route, index) => (
                          <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                          />
                        ))}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
                <ThemeToggleButton />
                <Toaster />
              </RouteGuard>
            </ChatHistoryProvider>
          </AuthProvider>
        </BackgroundProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
