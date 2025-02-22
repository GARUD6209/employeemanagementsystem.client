import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "./ConfirmationAlert.css";

const ConfirmationAlert = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  itemName,
  type = "info",
  timerDuration = 5, // Duration in seconds
}) => {
  const fullMessage = itemName ? `${message}: ${itemName}?` : message;
  const confirmButtonColor = type === "delete" ? "error" : "primary";
  const [remainingTime, setRemainingTime] = useState(timerDuration);
  const [disabled, setDisabled] = useState(type === "delete");

  useEffect(() => {
    let intervalId;
    if (type === "delete" && open) {
      setRemainingTime(timerDuration);
      setDisabled(true);
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [open, type, timerDuration]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setDisabled(false);
    }
  }, [remainingTime]);

  const confirmButtonClass =
    disabled && type === "delete" ? "confirm-button-disabled" : "";

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: "var(--card-bg-color)",
          color: "var(--text-color)",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ color: "var(--text-color)" }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "var(--text-color)" }}
        >
          {fullMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          autoFocus
          disabled={disabled}
          className={confirmButtonClass}
        >
          {disabled ? `Confirm (${remainingTime}s)` : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationAlert;
