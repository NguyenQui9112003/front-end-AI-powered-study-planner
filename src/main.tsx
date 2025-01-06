import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import './index.css'
import App from './App';

import { AuthProvider } from './helpers/context/authProvider';
import PrivateRoute from './helpers/context/privateRoute'

import { Error } from './components/common/error';
import { LoginForm } from './components/features/auth/LoginForm';
import { RegisterForm } from './components/features/auth/RegisterForm';
import { ProfilePage } from './pages/profilePage';
import { TaskManagementPage } from './pages/taskManagementPage';
import { AnalyzePage } from './pages/analyzePage';
import { GuestPage } from './pages/guestPage';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/guest" replace />,
      errorElement: <Error />,
    },
    {
      path: "/signIn",
      element: <LoginForm />,
      errorElement: <Error />,
    },
    {
      path: "/register",
      element: <RegisterForm />,
      errorElement: <Error />,
    },
    {
      path: "/guest",
      element: <GuestPage />,
      errorElement: <Error />,
    },
    {
      path: "/home",
      element: <PrivateRoute element={<App />} />,
      errorElement: <Error />,
    },
    {
      path: "/task-management",
      element: <PrivateRoute element={<TaskManagementPage />} />,
      errorElement: <Error />,
    },
    {
      path: "/analyze",
      element: <PrivateRoute element={<AnalyzePage />} />,
      errorElement: <Error />,
    },
    {
      path: "/profile",
      element: <PrivateRoute element={<ProfilePage />} />,
      errorElement: <Error />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
