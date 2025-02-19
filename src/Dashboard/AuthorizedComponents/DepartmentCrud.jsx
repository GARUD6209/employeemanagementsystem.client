import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

const DepartmentCrud = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "" });
  const [editDepartment, setEditDepartment] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Fetch Departments & Fix ID Mapping
  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/Department");

      if (!response.ok) {
        console.error("Failed to fetch departments");
        return;
      }

      const data = await response.json();
      console.log("Fetched departments:", data);

      // ✅ Ensure correct ID and Name Mapping
      setDepartments(
        data.map((d) => ({ id: d.departmentId, name: d.departmentName }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // ✅ Add Department
  const addDepartment = async () => {
    if (!newDepartment.name.trim()) {
      console.error("Department name is required");
      return;
    }

    try {
      const response = await fetch("/api/Department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentName: newDepartment.name }),
      });

      if (response.ok) {
        setNewDepartment({ name: "" });
        fetchDepartments();
      } else {
        console.error("Failed to add department");
      }
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // ✅ Update Department (Fixes Undefined ID Issue)
  const updateDepartment = async () => {
    if (!editDepartment.id || !editDepartment.name.trim()) {
      console.error("Invalid department data for update");
      return;
    }

    try {
      const response = await fetch(`/api/Department/${editDepartment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: editDepartment.id,
          departmentName: editDepartment.name,
        }),
      });

      if (response.ok) {
        setEditDepartment({ id: null, name: "" });
        fetchDepartments();
      } else {
        console.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  // ✅ Delete Department (Fixes Undefined ID Issue)
  const deleteDepartment = async (id) => {
    if (!id) {
      console.error("Invalid ID for delete operation");
      return;
    }

    try {
      const response = await fetch(`/api/Department/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDepartments();
      } else {
        console.error("Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        p: 2,
        bgcolor: "#1e1e1e",
        color: "white",
      }}
    >
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Department Management
        </Typography>

        {/* Add Department */}
        <TextField
          label="Department Name"
          variant="outlined"
          fullWidth
          size="small"
          value={newDepartment.name}
          onChange={(e) =>
            setNewDepartment({ ...newDepartment, name: e.target.value })
          }
          sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={addDepartment}
        >
          Add
        </Button>

        {/* Departments List */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Departments
        </Typography>
        <List>
          {departments.map((department) => (
            <ListItem
              key={department.id}
              sx={{ bgcolor: "#333", borderRadius: 1, mb: 1, p: 1 }}
            >
              {editDepartment.id === department.id ? (
                <TextField
                  fullWidth
                  size="small"
                  value={editDepartment.name}
                  onChange={(e) =>
                    setEditDepartment({
                      ...editDepartment,
                      name: e.target.value,
                    })
                  }
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                />
              ) : (
                <ListItemText primary={department.name} />
              )}

              <ListItemSecondaryAction>
                {editDepartment.id === department.id ? (
                  <>
                    <IconButton color="primary" onClick={updateDepartment}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => setEditDepartment({ id: null, name: "" })}
                    >
                      ❌
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        setEditDepartment({
                          id: department.id,
                          name: department.name,
                        })
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteDepartment(department.id)}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default DepartmentCrud;
