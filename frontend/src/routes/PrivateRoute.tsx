import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/auth/context/AuthContext';

export const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};
