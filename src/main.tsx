import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from './App';
import { RegisterForm } from './components/features/auth/RegisterForm';
import { LoginForm } from './components/features/auth/LoginForm';
import { Error } from './components/common/error';
import { AuthProvider } from './helpers/context/authProvider';
import { ProfilePage } from './pages/profilePage';
import { TaskManagementPage } from './pages/task-management-list';
import PrivateRoute from './helpers/context/privateRoute'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/signIn" replace />,
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
      path: "/profile",
      element: <ProfilePage />,
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
