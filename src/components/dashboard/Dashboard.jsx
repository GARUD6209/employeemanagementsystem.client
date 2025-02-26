import React from "react";
import { Grid2 as Grid, Paper, Typography, Box } from "@mui/material";
import adminIcon from "../../assets/admin-icon.png";
import employeeIcon from "../../assets/employee-icon.png";
import salaryIcon from "../../assets/salary-icon.png";
import { EmployeeService } from "../../services/EmployeeService";
import { UserService } from "../../services/UserService";

const Dashboard = () => {
  const employeeService = new EmployeeService();
  const [employeeCount, setEmployeeCount] = React.useState(0);
  const [salary, setSalary] = React.useState(0);
  const [adminCount, setAdminCount] = React.useState(0);
  const userServices = new UserService();

  React.useEffect(() => {
    employeeService.getAllEmployees().then((data) => {
      setEmployeeCount(data.length);
      setSalary(data.reduce((acc, curr) => acc + curr.salary, 0));
      setAdminCount(data.filter((emp) => emp.jobRole === "Admin").length);
    });

    // {
    //   "role": "Admin",
    //   "userCount": 2
    // }
    userServices.countAdmin().then((data) => {
      setAdminCount(data.userCount);
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center" }}>
      <Grid container spacing={3} justifyContent="center">
        {[
          { img: adminIcon, label: "Administrator", total: adminCount },
          { img: employeeIcon, label: "Employees", total: employeeCount },
          { img: salaryIcon, label: "Salary", total: salary },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={12}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
                color: "var(--text-color)",
                bgcolor: "var(--card-bg-color)",
              }}
            >
              <Box
                component="img"
                src={item.img}
                alt={item.label}
                sx={{ width: "170px", height: "220px", mb: 2 }}
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "var(--text-color)" }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "var(--text-color)" }}
              >
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
