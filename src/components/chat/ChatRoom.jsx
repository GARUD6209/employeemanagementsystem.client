import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChatService } from "../../services/ChatService";
import { Box, Paper, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import { EmployeeService } from "../../services/EmployeeService";
import { formatDistanceToNow, parseISO } from "date-fns";

const formatMessageTime = (timestamp) => {
  try {
    let date;

    if (typeof timestamp === "string") {
      // Remove microseconds if present and convert to a valid ISO format
      timestamp = timestamp.split(".")[0].replace(" ", "T") + "Z";
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    // Validate the date object
    if (isNaN(date.getTime())) {
      return "Just now";
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Just now";
  }
};

export const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId: currentUserId } = useAuth(); // Use useAuth to get userRole, selectedRole, and currentUserId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userNames, setUserNames] = useState(new Map());
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const pollingInterval = useRef(null);
  const messagesEndRef = useRef(null);
  const lastMessageTime = useRef(Date.now());
  const typingTimeoutRef = useRef(null);
  const chatService = new ChatService();
  const employeeService = new EmployeeService(); // Create an instance of EmployeeService

  useEffect(() => {
    loadMessages();
    startPolling();

    return () => stopPolling();
  }, [id]);

  useEffect(() => {
    const loadUserNames = async () => {
      const newUserNames = new Map(userNames);
      const uniqueUserIds = [...new Set(messages.map((m) => m.senderId))];

      for (const userId of uniqueUserIds) {
        if (!newUserNames.has(userId)) {
          const name = await employeeService.getEmployeeFullNameByUserId(
            userId
          );
          newUserNames.set(userId, name);
        }
      }

      setUserNames(newUserNames);
    };

    loadUserNames();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const loadMessages = useCallback(async () => {
    try {
      // Only fetch if more than 2 seconds have passed since last message
      if (Date.now() - lastMessageTime.current < 2000) {
        return;
      }

      const chatMessages = await chatService.getChatMessages(id);
      lastMessageTime.current = Date.now();

      setMessages((prev) => {
        // Only update if we have new messages
        if (prev.length !== chatMessages.length) {
          return chatMessages;
        }
        return prev;
      });
      setError(null);
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages. Please try again later.");
      stopPolling();
    }
  }, [id]);

  const startPolling = useCallback(() => {
    if (!pollingInterval.current) {
      pollingInterval.current = setInterval(loadMessages, 3000);
    }
  }, [loadMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = await chatService.sendMessage(id, newMessage);
      message.createdAt = new Date().toISOString();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      lastMessageTime.current = Date.now();
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const groupMessagesBySender = useCallback((messages) => {
    return messages.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup[0].senderId === message.senderId) {
        lastGroup.push(message);
      } else {
        groups.push([message]);
      }
      return groups;
    }, []);
  }, []);

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
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
          {error && (
            <Typography color="error" align="center" sx={{ py: 2 }}>
              {error}
            </Typography>
          )}
          {groupMessagesBySender(messages).map((group, groupIndex) => (
            <Box
              key={`group-${groupIndex}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  group[0].senderId === currentUserId
                    ? "flex-end"
                    : "flex-start",
                mb: 2,
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7, mb: 0.5 }}>
                {userNames.get(group[0].senderId) || "Loading..."}
              </Typography>
              {group.map((message, index) => (
                <Paper
                  key={message.id}
                  elevation={1}
                  sx={{
                    p: 1,
                    mb: 0.5,
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
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, display: "block", textAlign: "right" }}
                  >
                    {formatMessageTime(message.createdAt)}
                  </Typography>
                </Paper>
              ))}
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
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: "var(--input-bg-color)",
                color: "var(--text-color)",
              },
            }}
          />
          {isTyping && (
            <Typography
              variant="caption"
              sx={{ position: "absolute", top: -20, left: 16 }}
            >
              Someone is typing...
            </Typography>
          )}
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
