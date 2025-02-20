import React from "react";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";

const SidebarWrapper = ({ useRole, setAuthorized, setUserRole }) => {
  console.log(useRole);
  return useRole === "admin" ? (
    <>
      <AdminSidebar setAuthorized={setAuthorized} setUserRole={setUserRole} />
    </>
  ) : (
    <>
      <EmployeeSidebar
        setAuthorized={setAuthorized}
        setUserRole={setUserRole}
      />
    </>
  );
};

export default SidebarWrapper;
