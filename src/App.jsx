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

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

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
            authorized ? <Dashboard /> : <Navigate to="/login" replace={true} />
          }
        />
        <Route path="/weatherApi" element={<Home />} />
        <Route path="/add-department" element={<DepartmentCrud />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
