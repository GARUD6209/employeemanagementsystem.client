import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutLink from "../common/LogoutLink";
import { Logout } from "@mui/icons-material";

const EmployeeSidebar = ({
  setAuthorized,
  setUserRole,
  isCollapsed,
  toggleCollapse,
}) => {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3>EMS</h3>
        <MenuIcon className="toggle-button" onClick={toggleCollapse} />
      </div>
      <List>
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/announcements">
          <ListItemIcon>
            <AnnouncementIcon />
          </ListItemIcon>
          <ListItemText primary="Announcement Board" />
        </ListItem>
        <ListItem component={Link} to="/attendance">
          <ListItemIcon>
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText primary="Mark Attendance" />
        </ListItem>
        <ListItem component={Link} to="/leave-request">
          <ListItemIcon>
            <TimeToLeaveIcon />
          </ListItemIcon>
          <ListItemText primary="Leave Request" />
        </ListItem>
        <ListItem component={Link} to="/leave-list">
          <ListItemIcon>
            <TimeToLeaveIcon />
          </ListItemIcon>
          <ListItemText primary="Leave List" />
        </ListItem>
        <ListItem component={Link} to="/tasks">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Task List" />
        </ListItem>
        <ListItem component={Link} to="/schedule">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Your Schedule" />
        </ListItem>
        <ListItem component={Link} to="/feedback">
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem component={Link} to="/chat">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        <Divider />
        <ListItem>
          <LogoutLink setAuthorized={setAuthorized} setUserRole={setUserRole}>
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
