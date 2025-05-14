/**
 * Component that redirects authenticated users to their appropriate home page
 * based on their role (admin or normal user).
 */
import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuth({ children }) {
  const { isAuthenticated, getUser } = useAuth();
  if (!isAuthenticated) return children;

  const role = getUser().role;
  return role === "admin" ? (
    <Navigate to="/home-admin" replace />
  ) : (
    <Navigate to="/home-orders" replace />
  );
}
