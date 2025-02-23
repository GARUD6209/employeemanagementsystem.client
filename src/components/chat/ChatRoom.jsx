import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatService } from "../../services/ChatService";
import { Box, Paper, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const pollingInterval = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const chatService = new ChatService();

  useEffect(() => {
    loadMessages();
    startPolling();

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startPolling = () => {
    pollingInterval.current = setInterval(loadMessages, 3000);
  };

  const loadMessages = async () => {
    try {
      const chatMessages = await chatService.getChatMessages(id);
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const message = await chatService.sendMessage(id, newMessage);
        setMessages([...messages, message]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 40px)", // Reduced from 80px to 40px
        margin: "-20px", // Negate MainContent padding
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent any potential overflow
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: "var(--card-bg-color)",
          color: "var(--text-color)",
          overflow: "hidden", // Prevent Paper overflow
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => navigate("/chat")}
            sx={{ p: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Chat Room</Typography>
        </Box>

        {/* Messages List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            // Ensure content doesn't overflow horizontally
            maxWidth: "100%",
            "& > *": {
              maxWidth: "100%",
            },
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.senderId === currentUserId
                    ? "flex-end"
                    : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  maxWidth: "70%",
                  bgcolor:
                    message.senderId === currentUserId
                      ? "primary.main"
                      : "var(--chat-message-bg)",
                  color:
                    message.senderId === currentUserId
                      ? "white"
                      : "var(--text-color)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {message.senderId}
                </Typography>
                <Typography variant="body1">{message.content}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Field */}
        <Box
          sx={{
            p: "12px 16px", // Reduced padding
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "var(--card-bg-color)",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: "var(--input-bg-color)",
                color: "var(--text-color)",
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};
