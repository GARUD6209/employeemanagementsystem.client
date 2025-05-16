import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/AuthService";
import { EmployeeService } from "../services/EmployeeService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [employeeId, setEmployeeId] = useState(0);
  const [selectedRole, setSelectedRole] = useState(
    () => localStorage.getItem("selectedRole") || ""
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const authService = new AuthService();
  const employeeService = new EmployeeService();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authData = await authService.checkAuth();
      setUserId(authData.userId);
      updateAuthState(true, authData.role.toLowerCase());
    } catch (error) {
      console.error("Auth check failed:", error);
      updateAuthState(false, "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEmployeeId();
      // console.log("Employee ID fetched:", employeeId);
    }
  }, [userId]);

  const fetchEmployeeId = async () => {
    try {
      const data = await employeeService.getEmployeeIdByUserId(userId);

      const employeeId = typeof data === "object" ? data.employeeId : data;

      if (employeeId === undefined || employeeId === null) {
        throw new Error("Invalid employee ID received");
      }

      setEmployeeId(employeeId);
    } catch (error) {
      console.error("Error fetching employee ID:", error);
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
      clearRole();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const selectRole = (role) => {
    const lowercaseRole = role.toLowerCase();
    setSelectedRole(lowercaseRole);
    localStorage.setItem("selectedRole", lowercaseRole);
    sessionStorage.setItem("selectedRole", lowercaseRole); // Add session storage for redundancy
  };

  const clearRole = () => {
    setSelectedRole("");
    localStorage.removeItem("selectedRole");
    sessionStorage.removeItem("selectedRole");
  };

  // Add this method to check if role is valid
  const isValidRole = () => {
    return (
      selectedRole && ["admin", "employee"].includes(selectedRole.toLowerCase())
    );
  };

  const value = {
    authorized,
    userRole,
    userId,
    selectedRole,
    loading,
    employeeId,
    login,
    logout,
    checkAuthStatus,
    updateAuthState,
    selectRole, // Add this to exposed values
    errorMessage,
    redirecting,
    isValidRole,
    clearRole,
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
