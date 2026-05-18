import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // If there is no token payload, bounce them straight to login screen instantly
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise let them view the child routes seamlessly
  return <Outlet />;
};

export default ProtectedRoute;
