import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import ConfirmationAlert from "../common/ConfirmationAlert";
import { AnnouncementService } from "../../services/AnnouncementService";
import Announcement from "../../models/announcement.model";
import AddEditAnnouncementDialog from "./AddEditAnnouncementDialog";

const AnnouncementCrud = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });
  const [editConfirmation, setEditConfirmation] = useState({
    open: false,
    id: null,
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [dialogState, setDialogState] = useState({
    open: false,
    mode: "add",
    announcement: null,
  });

  const announcementService = new AnnouncementService();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching announcements:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ open: true, id: id });
  };

  const handleDeleteConfirm = async () => {
    await deleteAnnouncement(deleteConfirmation.id);
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleEditClick = (announcement) => {
    setEditConfirmation({
      open: true,
      id: announcement.announcementId,
      title: announcement.title,
      content: announcement.content,
    });
  };

  const handleEditConfirm = () => {
    setEditAnnouncement({
      id: editConfirmation.id,
      title: editConfirmation.title,
      content: editConfirmation.content,
    });
    setEditConfirmation({ open: false, id: null, title: "", content: "" });
  };

  const handleEditCancel = () => {
    setEditConfirmation({ open: false, id: null, title: "", content: "" });
  };

  const handleAddNew = () => {
    setDialogState({
      open: true,
      mode: "add",
      announcement: null,
    });
  };

  const handleEdit = (announcement) => {
    setDialogState({
      open: true,
      mode: "edit",
      announcement,
    });
  };

  const handleDialogClose = () => {
    setDialogState({
      open: false,
      mode: "add",
      announcement: null,
    });
  };

  const handleDialogSave = async (formData) => {
    try {
      const announcement = new Announcement();
      announcement.title = formData.title;
      announcement.content = formData.content;

      if (dialogState.mode === "add") {
        announcement.createdAt = new Date().toISOString();
        announcement.createdBy = localStorage.getItem("userId");
        await announcementService.createAnnouncement(announcement);
      } else {
        announcement.announcementId = dialogState.announcement.announcementId;
        announcement.createdAt = dialogState.announcement.createdAt;
        announcement.createdBy = dialogState.announcement.createdBy;
        await announcementService.updateAnnouncement(
          dialogState.announcement.announcementId,
          announcement
        );
      }
      await fetchAnnouncements();
    } catch (error) {
      setError(error.message);
      console.error("Error saving announcement:", error);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "auto",
        mt: 4,
        p: 2,
        bgcolor: "var(--card-bg-color, #f5f5f5)",
        color: "var(--text-color, #000000)",
        border: "1px solid var(--divider-color, #e0e0e0)",
      }}
    >
      <CardContent>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
        <Typography variant="h4" align="center" gutterBottom>
          Announcement Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddNew}
          sx={{ mb: 3 }}
        >
          Add New Announcement
        </Button>

        {/* Announcements List */}
        <List>
          {announcements.map((announcement) => (
            <ListItem
              key={announcement.announcementId}
              sx={{
                border: "1px solid var(--divider-color, #e0e0e0)",
                borderRadius: 1,
                mb: 1,
                p: 2,
                bgcolor: "var(--bg-color) !important",
                color: "var(--text-color) !important",
              }}
            >
              <ListItemText
                primary={announcement.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        bgcolor: "var(--bg-color) !important",
                        color: "var(--text-color) !important",
                      }}
                    >
                      {announcement.content}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        bgcolor: "var(--bg-color) !important",
                        color: "var(--text-color) !important",
                      }}
                    >
                      Created:{" "}
                      {new Date(announcement.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
                sx={{
                  bgcolor: "var(--bg-color) !important",
                  color: "var(--text-color) !important",
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(announcement)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(announcement.announcementId)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>

      <AddEditAnnouncementDialog
        open={dialogState.open}
        onClose={handleDialogClose}
        announcement={dialogState.announcement}
        onSave={handleDialogSave}
        mode={dialogState.mode}
      />

      <ConfirmationAlert
        open={deleteConfirmation.open}
        title="Confirm Delete"
        message="Are you sure you want to delete this announcement?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={
          announcements.find((a) => a.announcementId === deleteConfirmation.id)
            ?.title
        }
        type="delete"
      />
    </Card>
  );
};

export default AnnouncementCrud;
