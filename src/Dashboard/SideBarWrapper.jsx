import React from "react";
import AdminSidebar from "./AuthorizedComponents/AdminSidebar";
import EmployeeSidebar from "./AuthorizedComponents/EmployeeSidebar";

const SidebarWrapper = ({ useRole, setAuthorized, setUserRole }) => {
  console.log(useRole);
  return useRole === "Admin" ? (
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
