import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from './App';
import { RegisterForm } from './components/features/auth/RegisterForm';
import { LoginForm } from './components/features/auth/LoginForm';
import { Error } from './components/common/error';
import { ImageDetail } from './components/features/photo/imageDetail';
import { AuthProvider } from './helpers/context/authProvider';
import { ProfilePage } from './pages/profilePage';
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
      path: "/profile",
      element: <ProfilePage />,
      errorElement: <Error />,
    },
    {
      path: "/img-detail/:id",
      element: <ImageDetail />,
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
