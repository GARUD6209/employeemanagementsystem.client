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
import { Edit, Delete, Check } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import ConfirmationAlert from "../common/ConfirmationAlert";
import { DepartmentService } from "../../services/DepartmentService";
import Department from "../../models/department.model";

const DepartmentCrud = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "" });
  const [editDepartment, setEditDepartment] = useState({ id: null, name: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });
  const [editConfirmation, setEditConfirmation] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [error, setError] = useState("");

  const departmentService = new DepartmentService();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(
        data.map((d) => ({ id: d.departmentId, name: d.departmentName }))
      );
    } catch (error) {
      setError(error.message);
      console.error("Error fetching departments:", error);
    }
  };

  const addDepartment = async () => {
    if (!newDepartment.name.trim()) return;

    try {
      await departmentService.createDepartment(newDepartment.name);
      setNewDepartment({ name: "" });
      fetchDepartments();
    } catch (error) {
      setError(error.message);
      console.error("Error adding department:", error);
    }
  };

  const updateDepartment = async () => {
    if (!editDepartment.id || !editDepartment.name.trim()) return;

    try {
      await departmentService.updateDepartment(
        editDepartment.id,
        editDepartment.name
      );
      setEditDepartment({ id: null, name: "" });
      fetchDepartments();
    } catch (error) {
      setError(error.message);
      console.error("Error updating department:", error);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await departmentService.deleteDepartment(id);
      fetchDepartments();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting department:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ open: true, id: id });
  };

  const handleDeleteConfirm = async () => {
    await deleteDepartment(deleteConfirmation.id);
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleEditClick = (id, name) => {
    setEditConfirmation({ open: true, id: id, name: name });
  };

  const handleEditConfirm = () => {
    setEditDepartment({ id: editConfirmation.id, name: editConfirmation.name });
    setEditConfirmation({ open: false, id: null, name: "" });
  };

  const handleEditCancel = () => {
    setEditConfirmation({ open: false, id: null, name: "" });
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: "auto",
        mt: 4,
        p: 2,
        bgcolor: "var(--card-bg-color)",
        color: "var(--text-color)",
        border: "1px solid var(--divider-color)",
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
          sx={{
            mb: 2,
            borderRadius: 1,
          }}
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
              sx={{
                borderRadius: 1,
                mb: 1,
                p: 1,
                display: "flex",
                alignItems: "center",
                color: "var(--text-color)",
                border: "1px solid var(--divider-color)", // Add this line to add a border
              }}
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
                  sx={{
                    bgcolor: "var(--input-bg-color) !important",
                    borderRadius: 1,
                    color: "var(--text-color)",
                  }}
                />
              ) : (
                <ListItemText
                  primary={department.name}
                  sx={{ color: "var(--text-color)" }}
                />
              )}

              <ListItemSecondaryAction
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "var(--text-color)",
                }}
              >
                {editDepartment.id === department.id ? (
                  <>
                    <IconButton color="primary" onClick={updateDepartment}>
                      <Check />
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
                        handleEditClick(department.id, department.name)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(department.id)}
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
      <ConfirmationAlert
        open={deleteConfirmation.open}
        title="Confirm Delete"
        message="Are you sure you want to delete this department"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={departments.find((d) => d.id === deleteConfirmation.id)?.name}
        type="delete" // Specify type as "delete"
      />
      <ConfirmationAlert
        open={editConfirmation.open}
        title="Confirm Edit"
        message="Are you sure you want to edit this department"
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
        itemName={editConfirmation.name}
        type="edit" // Optionally specify type as "edit"
      />
    </Card>
  );
};

export default DepartmentCrud;
