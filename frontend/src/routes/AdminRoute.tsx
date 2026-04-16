import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/auth/context/AuthContext';

export const AdminRoute = () => {
  const { isLoggedIn, user } = useAuth();
  return isLoggedIn && user?.roles.includes('ADMIN') ? <Outlet /> : <Navigate to="/" replace />;
};
