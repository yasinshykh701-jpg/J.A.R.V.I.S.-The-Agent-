import { lazy } from 'react';

// Eager load critical pages
import LoginPage from './pages/LoginPage';
import HomePageCircular from './pages/HomePageCircular';

// Lazy load everything else
const LandingPage           = lazy(() => import('./pages/LandingPage'));
const HomePage              = lazy(() => import('./pages/HomePage'));
const ChatPage              = lazy(() => import('./pages/ChatPage'));
const RegisterPage          = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage    = lazy(() => import('./pages/ForgotPasswordPage'));
const AdminPanel            = lazy(() => import('./pages/AdminPanel'));
const UserPanel             = lazy(() => import('./pages/UserPanel'));
const DashboardPage         = lazy(() => import('./pages/DashboardPage'));
const VirtualRobotPage      = lazy(() => import('./pages/VirtualRobotPage'));
const InterviewPrepPage     = lazy(() => import('./pages/InterviewPrepPage'));
const VideoGenerationPage   = lazy(() => import('./pages/VideoGenerationPageNew'));
const ImageGenerationPage   = lazy(() => import('./pages/ImageGenerationPageNew'));
const ResumeAnalysisPage    = lazy(() => import('./pages/ResumeAnalysisPage'));
const PromptGeneratorPage   = lazy(() => import('./pages/PromptGeneratorPage'));
const NoteSummaryPage       = lazy(() => import('./pages/NoteSummaryPage'));
const PPTMakerPage          = lazy(() => import('./pages/PPTMakerPage'));
const VideoEditorPage       = lazy(() => import('./pages/VideoEditorPage'));
const SettingsPage          = lazy(() => import('./pages/SettingsPage'));
const AIVideoGenerationPage = lazy(() => import('./pages/AIVideoGenerationPage'));
const AIImageGenerationPage = lazy(() => import('./pages/AIImageGenerationPage'));
const BackgroundSettingsPage= lazy(() => import('./pages/BackgroundSettingsPage'));
const JarvisServicesHub     = lazy(() => import('./pages/JarvisServicesHub'));
const LLMEnginePage         = lazy(() => import('./pages/LLMEnginePage'));

import type { ReactNode } from 'react';

interface RouteConfig {
  name:     string;
  path:     string;
  element:  ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  { name: 'Home',                path: '/',                     element: <HomePageCircular /> },
  { name: 'Landing',             path: '/landing',              element: <LandingPage />,               visible: false },
  { name: 'Chat',                path: '/chat',                 element: <ChatPage />,                  visible: false },
  { name: 'Dashboard',           path: '/dashboard',            element: <DashboardPage />,             visible: false },
  { name: 'Home Grid',           path: '/home',                 element: <HomePage />,                  visible: false },
  { name: 'Login',               path: '/login',                element: <LoginPage />,                 visible: false },
  { name: 'Register',            path: '/register',             element: <RegisterPage />,              visible: false },
  { name: 'Forgot Password',     path: '/forgot-password',      element: <ForgotPasswordPage />,        visible: false },
  { name: 'Admin Panel',         path: '/admin',                element: <AdminPanel />,                visible: false },
  { name: 'User Profile',        path: '/profile',              element: <UserPanel />,                 visible: false },

  // ── AI Services ──────────────────────────────────────────────────────────
  { name: 'AI Image Generation', path: '/ai-image-generation',  element: <AIImageGenerationPage />,     visible: false },
  { name: 'Gemini Image Gen',    path: '/gemini-image-generation', element: <AIImageGenerationPage />,  visible: false },
  { name: 'Image Generation',    path: '/image-generation',     element: <ImageGenerationPage />,       visible: false },
  { name: 'AI Video Generation', path: '/ai-video-generation',  element: <AIVideoGenerationPage />,     visible: false },
  { name: 'Video Generation',    path: '/video-generation',     element: <VideoGenerationPage />,       visible: false },
  { name: 'Virtual Robot',       path: '/virtual-robot',        element: <VirtualRobotPage />,          visible: false },
  { name: 'Resume Analysis',     path: '/resume-analysis',      element: <ResumeAnalysisPage />,        visible: false },
  { name: 'Interview Prep',      path: '/interview-prep',       element: <InterviewPrepPage />,         visible: false },
  { name: 'Prompt Generator',    path: '/prompt-generator',     element: <PromptGeneratorPage />,       visible: false },
  { name: 'Note Summary',        path: '/note-summary',         element: <NoteSummaryPage />,           visible: false },
  { name: 'PPT Maker',           path: '/ppt-maker',            element: <PPTMakerPage />,              visible: false },
  { name: 'Video Editor',        path: '/video-editor',         element: <VideoEditorPage />,           visible: false },

  // ── JARVIS Local AI ───────────────────────────────────────────────────────
  {
    name:    'LLM Engines',
    path:    '/llm-engines',
    element: <LLMEnginePage />,
    visible: false,
  },
  {
    name:    'Services Hub',
    path:    '/services-hub',
    element: <JarvisServicesHub />,
    visible: false,
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  { name: 'Background Settings', path: '/background-settings',  element: <BackgroundSettingsPage />,    visible: false },
  { name: 'Settings',            path: '/settings',             element: <SettingsPage />,              visible: false },
];

export default routes;
