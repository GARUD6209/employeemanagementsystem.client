import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
  Dashboard as DashboardIcon,
  Announcement as AnnouncementIcon,
  EventAvailable as EventAvailableIcon,
  TimeToLeave as TimeToLeaveIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Feedback as FeedbackIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Logout,
} from "@mui/icons-material";

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutLink from "../common/LogoutLink";

const EmployeeSidebar = ({ isCollapsed, toggleCollapse }) => {
  const menuItems = [
    {
      title: "My Profile",
      path: "/employee-dashboard",
      icon: <PersonIcon />,
    },
    {
      title: "Announcement Board",
      path: "/announcements",
      icon: <AnnouncementIcon />,
    },
    {
      title: "Mark Attendance",
      path: "/create-attendance",
      icon: <EventAvailableIcon />,
    },
    {
      title: "Leave Request",
      path: "/leave-request",
      icon: <TimeToLeaveIcon />,
    },
    {
      title: "Leave List",
      path: "/leave-list",
      icon: <TimeToLeaveIcon />,
    },
    {
      title: "Task List",
      path: "/employee-tasks",
      icon: <AssignmentIcon />,
    },
    {
      title: "Your Schedule",
      path: "/schedule",
      icon: <ScheduleIcon />,
    },
    {
      title: "Feedback",
      path: "/create-feedback",
      icon: <FeedbackIcon />,
    },
    {
      title: "Chat",
      path: "/chat",
      icon: <ChatIcon />,
    },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3>EMS</h3>
        <MenuIcon className="toggle-button" onClick={toggleCollapse} />
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <LogoutLink>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </LogoutLink>
        </ListItem>
      </List>
    </div>
  );
};

export default EmployeeSidebar;
