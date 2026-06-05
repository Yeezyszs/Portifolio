import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { SignupPage } from '../pages/auth/SignupPage.jsx';
import { UserPortfolioPage } from '../pages/public/UserPortfolioPage.jsx';
import { ProjectDetailPage } from '../pages/public/ProjectDetailPage.jsx';
import { DashboardHome } from '../pages/dashboard/DashboardHome.jsx';
import { ProjectsPage } from '../pages/dashboard/ProjectsPage.jsx';
import { SkillsPage } from '../pages/dashboard/SkillsPage.jsx';
import { SettingsPage } from '../pages/dashboard/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/u/:username', element: <UserPortfolioPage /> },
      { path: '/u/:username/:slug', element: <ProjectDetailPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'skills', element: <SkillsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
