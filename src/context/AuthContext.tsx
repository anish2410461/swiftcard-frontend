import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  };

  const checkAdminStatus = (payload: any) => {
    if (!payload) return false;
    const role = payload.role || payload.roles;
    return role === 'ADMIN' || role === 'ROLE_ADMIN' || (Array.isArray(role) && (role.includes('ADMIN') || role.includes('ROLE_ADMIN')));
  };

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeToken(token);
      const isExpired = payload && payload.exp && (payload.exp * 1000 < Date.now());
      
      if (payload && !isExpired) {
        setIsAuthenticated(true);
        setIsAdmin(checkAdminStatus(payload));
        setUsername(payload.sub || payload.username || null);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const payload = decodeToken(token);
    setIsAuthenticated(true);
    setIsAdmin(checkAdminStatus(payload));
    setUsername(payload?.sub || payload?.username || null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
