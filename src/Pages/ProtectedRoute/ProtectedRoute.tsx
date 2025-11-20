import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAppSelector((state) => state.login);

  // Correct authentication check
  const isAuthenticated = Boolean(token || localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;

  }
  return <>{children}</>;
};

export default ProtectedRoute;
