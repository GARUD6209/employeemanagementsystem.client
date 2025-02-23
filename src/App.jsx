import React, { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeToggle from "./components/common/ThemeToggle.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import RoleSelection from "./Pages/RoleSelection.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import WeatherForecast from "./components/common/WeatherForecast.jsx";
import DepartmentCrud from "./components/department/DepartmentCrud.jsx";
import EmployeePage from "./components/employee/EmployeePage.jsx";
import AnnouncementCrud from "./components/announcement/AnnouncementCrud.jsx";
import MainContent from "./components/layout/MainContent";
import SidebarWrapper from "./components/sidebar/SidebarWrapper.jsx";
import PublicNavbar from "./components/common/PublicNavbar";
import { ChatRooms } from "./components/chat/ChatRooms";
import { ChatRoom } from "./components/chat/ChatRoom";

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      try {
        const response = await fetch("/pingauth", {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        });

        if (response.status === 200) {
          const data = await response.json();

          setAuthorized(true);
          if (data.roles[0] === "Admin") {
            setUserRole("admin");
          } else {
            setUserRole("employee");
          }

          // localStorage.setItem("userRole", data.roles[0].toLowerCase());
          localStorage.setItem("userId", data.userId);
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error fetching authorization status:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuthorization();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <ThemeToggle />
      <div className="App">
        {!authorized ? (
          <>
            <PublicNavbar />
            <div style={{ paddingTop: "64px" }}>
              {" "}
              {/* Add padding for AppBar */}
              <Routes>
                <Route
                  path="/"
                  element={<RoleSelection setUserRole={setUserRole} />}
                />
                <Route
                  path="/login"
                  element={<Login setAuthorized={setAuthorized} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
              </Routes>
            </div>
          </>
        ) : (
          <>
            <SidebarWrapper
              useRole={userRole}
              setAuthorized={setAuthorized}
              setUserRole={setUserRole}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            <MainContent isCollapsed={isCollapsed}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Dashboard />} />
                <Route path="/weatherApi" element={<WeatherForecast />} />
                <Route path="/add-department" element={<DepartmentCrud />} />
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/announcements" element={<AnnouncementCrud />} />
                <Route path="/chat" element={<ChatRooms />} />
                <Route path="/chat/:id" element={<ChatRoom />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
              </Routes>
            </MainContent>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
