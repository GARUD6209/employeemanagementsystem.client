import React from "react";
import { Box, styled } from "@mui/material";

const StyledInput = styled("input")({
  padding: "10px",
  width: "250px",
  borderRadius: "4px",
  border: "1px solid var(--input-border)",
  backgroundColor: "var(--input-bg)",
  color: "var(--text-color)",
  fontSize: "16px",
  "&:hover": {
    borderColor: "var(--primary-color)",
  },
  "&:focus": {
    outline: "none",
    borderColor: "var(--primary-color)",
    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
  },
  "&::-webkit-calendar-picker-indicator": {
    filter: "var(--calendar-icon-filter)",
    cursor: "pointer",
    backgroundColor: "var(--calendar-bg)",
    padding: "8px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "var(--calendar-hover-bg)",
    },
  },
  // Add color-scheme to ensure calendar dropdown matches theme
  colorScheme: "var(--calendar-color-scheme)",
});

const CustomDatePicker = ({ value, onChange }) => {
  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    onChange(newDate);
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <Box sx={{ position: "relative" }}>
      <StyledInput
        type="date"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
      />
    </Box>
  );
};

export default CustomDatePicker;
