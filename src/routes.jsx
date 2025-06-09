// src/routes.jsx
import React from 'react';
import { StartPage } from './pages/startPage';
import { AuthPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NotFoundPage } from './pages/notFound';
import { ProtectedRoute } from './components/routes/ProtectedRoute';

export const routes = [
  { path: "/", element: <StartPage /> },
  { 
    path: "/dashboard/*", 
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  { path: "/auth/*", element: <AuthPage /> },
  { path: "*", element: <NotFoundPage /> },
];
