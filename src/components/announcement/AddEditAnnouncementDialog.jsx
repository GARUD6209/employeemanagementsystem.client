import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const AddEditAnnouncementDialog = ({
  open,
  onClose,
  onSave,
  announcement,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
      });
    } else {
      setFormData({ title: "", content: "" });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "var(--dialog-bg-color, #ffffff)",
          color: "var(--text-color, #000000)",
        },
      }}
    >
      <DialogTitle>
        {mode === "add" ? "Add New Announcement" : "Edit Announcement"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          sx={{
            mb: 2,
            color: "var(--text-color, #000000)",
            "& .MuiInputBase-input": {
              color: "var(--text-color, #000000)",
            },
            "& .MuiInputLabel-root": {
              color: "var(--text-secondary-color, #757575)",
            },
          }}
        />
        <TextField
          margin="dense"
          name="content"
          label="Content"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.content}
          onChange={handleChange}
          sx={{
            color: "var(--text-color, #000000)",
            "& .MuiInputBase-input": {
              color: "var(--text-color, #000000)",
            },
            "& .MuiInputLabel-root": {
              color: "var(--text-secondary-color, #757575)",
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!formData.title.trim() || !formData.content.trim()}
        >
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditAnnouncementDialog;
