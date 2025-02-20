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

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutLink from "../../Common/LogoutLink";

const EmployeeSidebar = ({ setAuthorized, setUserRole }) => {
  return (
    <div className="sidebar">
      <h3>EMS</h3>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/announcements">
          <ListItemIcon>
            <AnnouncementIcon />
          </ListItemIcon>
          <ListItemText primary="Announcement Board" />
        </ListItem>
        <ListItem button component={Link} to="/attendance">
          <ListItemIcon>
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText primary="Mark Attendance" />
        </ListItem>
        <ListItem button component={Link} to="/leave-request">
          <ListItemIcon>
            <TimeToLeaveIcon />
          </ListItemIcon>
          <ListItemText primary="Leave Request" />
        </ListItem>
        <ListItem button component={Link} to="/leave-list">
          <ListItemIcon>
            <TimeToLeaveIcon />
          </ListItemIcon>
          <ListItemText primary="Leave List" />
        </ListItem>
        <ListItem button component={Link} to="/tasks">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Task List" />
        </ListItem>
        <ListItem button component={Link} to="/schedule">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Your Schedule" />
        </ListItem>
        <ListItem button component={Link} to="/feedback">
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem button component={Link} to="/chat">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        <Divider />
        <ListItem>
          <LogoutLink setAuthorized={setAuthorized} setUserRole={setUserRole} />
        </ListItem>
      </List>
    </div>
  );
};

export default EmployeeSidebar;
