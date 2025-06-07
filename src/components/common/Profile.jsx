import React, { useState } from "react";
import { Grid, Typography } from "@mui/material"; // Add Typography
import { DepartmentService } from "../../services/DepartmentService";

const Profile = ({ employee }) => {
  const departmentService = new DepartmentService();
  const [department, setDepartment] = useState(null);

  React.useEffect(() => {
    loadDepartment();
  }, []);

  const loadDepartment = async () => {
    try {
      const departmentData = await departmentService.getDepartmentById(
        employee.departmentId
      );
      setDepartment(departmentData.departmentName);
    } catch (error) {
      console.error("Error loading department data:", error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <img
          src={
            employee.photo
              ? `data:image/jpeg;base64,${employee.photo}`
              : "/default-avatar.png"
          }
          alt={`${employee.firstName} ${employee.lastName}`}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="h5" gutterBottom>
          {employee.firstName} {employee.lastName}
        </Typography>
        <Typography>Id: {employee.employeeId}</Typography>
        <Typography>Email: {employee.email}</Typography>
        <Typography>Job Role: {employee.jobRole}</Typography>
        <Typography>Department: {department}</Typography>
        <Typography>Contact: {employee.contact}</Typography>
        <Typography>Emergency Contact: {employee.emergencyContact}</Typography>
        <Typography>Address: {employee.address}</Typography>
      </Grid>
    </Grid>
  );
};

export default Profile;
