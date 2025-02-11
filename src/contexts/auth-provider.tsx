import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, refreshAccessToken } from "@/api/auth";
import { Permission } from "@/types/permission.enum";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  user: { userId: string; roleId?: string; permissions: Permission[] } | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type ExtendedJwtPayload = JwtPayload & {
  userId: string;
  roleId?: string;
  permissions: Permission[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    userId: string;
    roleId?: string;
    permissions: Permission[];
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateUserFromToken = (decodedToken: ExtendedJwtPayload) => {
    setUser({
      userId: decodedToken.userId,
      roleId: decodedToken.roleId,
      permissions: decodedToken.permissions,
    });
  };

  const handleToken = (token: string) => {
    try {
      if (!token) {
        throw new Error("Empty token received");
      }
      const decodedToken = jwtDecode<ExtendedJwtPayload>(token);
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        refreshToken();
      } else {
        setToken(token);
        localStorage.setItem("token", token);
        updateUserFromToken(decodedToken);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Token handling error:", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const newToken = await refreshAccessToken();
      const decodedToken = jwtDecode<ExtendedJwtPayload>(newToken);
      setToken(newToken);
      localStorage.setItem("token", newToken);
      updateUserFromToken(decodedToken);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      handleToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      
      if (!response?.data?.token) {
        throw new Error("Invalid credentials");
      }

      const { token, refreshToken: newRefreshToken } = response.data;
      handleToken(token);
      localStorage.setItem("refreshToken", newRefreshToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Important: Rethrow the error
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};