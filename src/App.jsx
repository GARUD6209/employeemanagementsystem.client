import React, { useState } from "react";
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AdminTaskManagement from "./components/tasks/AdminTaskManagement";
import EmployeeTaskView from "./components/tasks/EmployeeTaskView";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";

const AppContent = () => {
  const { authorized, loading, userRole } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      {!authorized ? (
        <>
          <PublicNavbar />
          <div style={{ paddingTop: "64px" }}>
            <Routes>
              <Route path="/" element={<RoleSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <SidebarWrapper
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
              <Route path="/tasks" element={<AdminTaskManagement />} />
              <Route path="/employee-tasks" element={<EmployeeTaskView />} />
              <Route
                path="/employee-dashboard"
                element={<EmployeeDashboard />}
              />
              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
          </MainContent>
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeToggle />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
