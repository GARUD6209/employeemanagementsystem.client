import React from "react";
import { Link } from "react-router-dom";
import SidebarWrapper from "../sidebar/SidebarWrapper";

function Navigation({ authorized, setAuthorized, userRole, setUserRole }) {
  console.log(userRole);
  return (
    <>
      {authorized ? (
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
