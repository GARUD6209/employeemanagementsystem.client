import React from "react";
import { Link } from "react-router-dom";
// import Sidebar from "../components/dashboard/Dashboard/SideBar";
import SidebarWrapper from "../components/dashboard/Dashboard/SideBarWrapper";

function Navigation({ authorized, setAuthorized, userRole, setUserRole }) {
  console.log(userRole);
  return (
    <>
      {authorized ? (
        // <Sidebar setAuthorized={setAuthorized} />
        <SidebarWrapper
          useRole={userRole}
          setAuthorized={setAuthorized}
          setUserRole={setUserRole}
        />
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/">Landing</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default Navigation;
