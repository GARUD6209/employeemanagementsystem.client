import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ChatIcon from "@mui/icons-material/Chat";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LogoutLink from "../Common/LogoutLink";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const Sidebar = ({ setAuthorized }) => {
  return (
    <div className="sidebar">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/employees">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Employees Management" />
        </ListItem>
        <ListItem button component={Link} to="/add-department">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Department" />
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
          <ListItemText primary="View Attendance" />
        </ListItem>
        <ListItem button component={Link} to="/leave-management">
          <ListItemIcon>
            <TimeToLeaveIcon />
          </ListItemIcon>
          <ListItemText primary="Leave Management" />
        </ListItem>
        <ListItem button component={Link} to="/tasks">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Task Management" />
        </ListItem>
        <ListItem button component={Link} to="/schedule">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Your Schedule" />
        </ListItem>
        <ListItem button component={Link} to="/employee-schedule">
          <ListItemIcon>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText primary="Employees Schedule" />
        </ListItem>
        <ListItem button component={Link} to="/feedback">
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText primary="Feedback Management" />
        </ListItem>
        <ListItem button component={Link} to="/chat">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chat" />
        </ListItem>
        <ListItem button component={Link} to="/weatherApi">
          <ListItemIcon>
            <WbSunnyIcon />
          </ListItemIcon>
          <ListItemText primary="Weather API" />
        </ListItem>
        <Divider />
        <ListItem>
          <LogoutLink setAuthorized={setAuthorized} />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
