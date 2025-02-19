import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import "./Dashboard.css";

import adminIcon from "../assets/admin-icon.png";
import employeeIcon from "../assets/employee-icon.png";
import salaryIcon from "../assets/salary-icon.png";

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center" }}>
      <Grid container spacing={3} justifyContent="center">
        {[
          { img: adminIcon, label: "Administrator", total: "1" },
          { img: employeeIcon, label: "Employees", total: "1" },
          { img: salaryIcon, label: "Salary", total: "Rs. 90008" },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Box
                component="img"
                src={item.img}
                alt={item.label}
                sx={{ width: "80px", height: "80px", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {item.label}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Total: {item.total}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
