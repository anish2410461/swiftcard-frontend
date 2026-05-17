import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  let isAdmin = false;
  let parsedRole = null;
  let failedParse = false;

  try {
    // Basic base64 payload decode instead of relying on external jwt-decode library
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if the role is ADMIN or ROLE_ADMIN
    parsedRole = payload.role || payload.roles; // depending on your Spring Boot setup
    
    // In our case we accept either ADMIN or ROLE_ADMIN
    if (parsedRole === 'ADMIN' || parsedRole === 'ROLE_ADMIN' || (Array.isArray(parsedRole) && (parsedRole.includes('ADMIN') || parsedRole.includes('ROLE_ADMIN')))) {
      isAdmin = true;
    }
  } catch (err) {
    console.error("KICKED: Failed to parse token.", err);
    failedParse = true;
  }

  if (failedParse) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    console.log("SUCCESS: Welcome Admin!");
    return <Outlet />;
  } else {
    // User is authenticated but not an admin, redirect them safely
    console.warn("KICKED: Role is not ADMIN. Role found:", parsedRole);
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
