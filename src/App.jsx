import React, { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeToggle from "./components/common/ThemeToggle.jsx";
import Navigation from "./components/common/Navigation.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import RoleSelection from "./Pages/RoleSelection.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import WeatherForecast from "./components/common/WeatherForecast.jsx";
import DepartmentCrud from "./components/department/DepartmentCrud.jsx";
import EmployeePage from "./components/employee/EmployeePage.jsx";
import AnnouncementCrud from "./components/announcement/AnnouncementCrud.jsx";

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

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
          setUserRole(data.roles[0].toLowerCase());
          localStorage.setItem("userRole", data.roles[0]);
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
      <Navigation
        authorized={authorized}
        setAuthorized={setAuthorized}
        userRole={userRole}
        setUserRole={setUserRole}
      />
      <ThemeToggle />
      <Routes>
        <Route
          path="/"
          element={
            authorized ? (
              <Navigate to="/home" />
            ) : (
              <RoleSelection setUserRole={setUserRole} />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setAuthorized={setAuthorized} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            authorized ? <Dashboard /> : <Navigate to="/" replace={true} />
          }
        />
        <Route path="/weatherApi" element={<WeatherForecast />} />
        <Route path="/add-department" element={<DepartmentCrud />} />
        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/announcements" element={<AnnouncementCrud />} />

        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
