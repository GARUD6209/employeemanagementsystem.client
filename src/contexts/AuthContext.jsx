import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/AuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // Add this line
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const authService = new AuthService();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = await authService.checkAuth();
      setUserId(authData.userId);
      updateAuthState(true, authData.role);
    } catch (error) {
      console.error("Auth check failed:", error);
      updateAuthState(false, "");
    } finally {
      setLoading(false);
    }
  };

  const updateAuthState = (isAuthorized, role) => {
    setAuthorized(isAuthorized);
    setUserRole(role.toLowerCase());

    if (!isAuthorized) {
      setSelectedRole("");
    }
  };

  const login = async (email, password, role, rememberMe) => {
    try {
      await authService.login(email, password, role, rememberMe);
      const authData = await authService.checkAuth();
      if (authData.role.toLowerCase() !== role.toLowerCase()) {
        setRedirecting(true);
        setErrorMessage(
          "Wrong role selected. Redirecting to role selection..."
        );
        await logout();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setRedirecting(false);
        setErrorMessage("");
        throw new Error("Selected role does not match your assigned role");
      }
      updateAuthState(true, authData.role);
      return true;
    } catch (error) {
      updateAuthState(false, "");
      if (error.message === "Role mismatch") {
        setRedirecting(true);
        setErrorMessage(
          "Wrong role selected. Redirecting to role selection..."
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setRedirecting(false);
        setErrorMessage("");
        throw new Error(
          "Selected role does not match your assigned role. Please select the correct role."
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      updateAuthState(false, "");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role.toLowerCase());
  };

  const value = {
    authorized,
    userRole,
    userId,
    selectedRole,
    loading,
    login,
    logout,
    checkAuthStatus,
    updateAuthState,
    selectRole, // Add this to exposed values
    errorMessage,
    redirecting,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
