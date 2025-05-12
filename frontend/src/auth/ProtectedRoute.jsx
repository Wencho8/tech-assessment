/**
 * Component that protects routes by checking if the user is authenticated
 * and has the required role to access the route.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ProtectedRoute({ roles = [] }) {
  const { isAuthenticated, getUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const userRole = getUser()?.role;
  if (!roles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
}
