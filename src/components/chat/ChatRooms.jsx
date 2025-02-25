import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatService } from "../../services/ChatService";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { EmployeeService } from "../../services/EmployeeService";

export const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [userNames, setUserNames] = useState(new Map());
  const chatService = new ChatService();
  // const employeeService = new EmployeeService();

  useEffect(() => {
    loadChatRooms();
    // loadUserNames();
  }, []);

  const loadChatRooms = async () => {
    try {
      const rooms = await chatService.getChatRooms();
      setChatRooms(Array.isArray(rooms) ? rooms : []);
    } catch (error) {
      setError("Error loading chat rooms");
      console.error("Error loading chat rooms:", error);
    }
  };

  // const loadUserNames = async () => {
  //   const newUserNames = new Map(userNames);
  //   const uniqueUserIds = [...new Set(chatRooms.map((r) => r.createdBy))];

  //   for (const userId of uniqueUserIds) {
  //     if (!newUserNames.has(userId)) {
  //       const name = await employeeService.getEmployeeFullNameByUserId(userId);
  //       newUserNames.set(userId, name);
  //     }
  //   }

  //   setUserNames(newUserNames);
  // };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const room = await chatService.createChatRoom(newRoomName);
      setChatRooms((prevRooms) => [...prevRooms, room]);
      setNewRoomName("");
    } catch (error) {
      setError("Error creating chat room");
      console.error("Error creating room:", error);
    }
  };

  // Guard against non-array chatRooms
  const roomsList = Array.isArray(chatRooms) ? chatRooms : [];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "var(--card-bg-color)",
          color: "var(--text-color)",
        }}
      >
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6">Chat Rooms</Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="New room name"
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "var(--input-bg-color)",
                  color: "var(--text-color)",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={createRoom}
              disabled={!newRoomName.trim()}
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List sx={{ bgcolor: "var(--card-bg-color)" }}>
            {roomsList.map((room) => (
              <ListItem
                key={room.chatRoomId}
                onClick={() => navigate(`/chat/${room.chatRoomId}`)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateX(8px)",
                    boxShadow: 1,
                    color: "var(--text-color)",
                  },
                  mb: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <ListItemText
                  primary={room.chatRoomName}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          display: "block",
                          opacity: 0.7,
                          color: "var(--text-color)",
                        }}
                      >
                        Created by:{}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ opacity: 0.5, color: "var(--text-color)" }}
                      >
                        {new Date(room.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                  sx={{
                    color: "var(--text-color)",
                    bgcolor: "var(--card-bg-color)",
                  }}
                />
              </ListItem>
            ))}
          </List>
          {roomsList.length === 0 && (
            <Typography sx={{ textAlign: "center", py: 3, opacity: 0.7 }}>
              No chat rooms available
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
