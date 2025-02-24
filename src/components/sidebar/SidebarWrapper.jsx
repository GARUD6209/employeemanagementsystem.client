import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../contexts/AuthContext";

const SidebarWrapper = ({ isCollapsed, setIsCollapsed }) => {
  const { userRole } = useAuth();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return userRole === "admin" ? (
    <AdminSidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
  ) : (
    <EmployeeSidebar
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
    />
  );
};

export default SidebarWrapper;
