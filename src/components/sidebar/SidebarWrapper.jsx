import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { Person } from "@mui/icons-material";

const employeeMenuItems = [
  {
    title: "My Dashboard",
    path: "/employee-dashboard",
    icon: <Person />,
  },
];

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
      menuItems={employeeMenuItems}
    />
  );
};

export default SidebarWrapper;
