import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import RoleSelection from "./Pages/RoleSelection.jsx";
import Navigation from "./Common/Navigation.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import DepartmentCrud from "./Dashboard/AuthorizedComponents/DepartmentCrud.jsx";
import EmployeePage from "./components/EmployeePage.jsx";
import ThemeToggle from "./Dashboard/AuthorizedComponents/ThemeToggle.jsx";
import WeatherForecast from "./Common/WeatherForecast.jsx";

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
          setUserRole(data.roles[0]);
          localStorage.setItem("userRole", data.roles[0]);
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
          element={authorized ? <Navigate to="/home" /> : <RoleSelection />}
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
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
