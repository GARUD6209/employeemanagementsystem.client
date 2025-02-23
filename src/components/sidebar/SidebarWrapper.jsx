import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";

const SidebarWrapper = ({
  useRole,
  setAuthorized,
  setUserRole,
  isCollapsed,
  setIsCollapsed,
}) => {
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return useRole === "admin" ? (
    <AdminSidebar
      setAuthorized={setAuthorized}
      setUserRole={setUserRole}
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
    />
  ) : (
    <EmployeeSidebar
      setAuthorized={setAuthorized}
      setUserRole={setUserRole}
      isCollapsed={isCollapsed}
      toggleCollapse={toggleCollapse}
    />
  );
};

export default SidebarWrapper;
