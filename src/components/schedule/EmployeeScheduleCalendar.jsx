import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { EmployeeScheduleService } from "../../services/EmployeeScheduleService";
// import { EmployeeService } from "../../services/EmployeeService";
// import { useAuth } from "../../contexts/AuthContext";

const EmployeeScheduleCalendar = ({ employeeId }) => {
  const [schedules, setSchedules] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const scheduleService = new EmployeeScheduleService();
  // const employeeService = new EmployeeService();
  // const { userId } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    startTime: new Date(),
    endTime: new Date(),
    location: "",
  });

  useEffect(() => {
    if (employeeId) {
      loadSchedules();
    }
  }, [employeeId]);

  const loadSchedules = async () => {
    try {
      const data = await scheduleService.getAllSchedules();
      setSchedules(data.filter((s) => s.employeeId === employeeId));
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Enhanced validation
      if (!employeeId) {
        throw new Error("Employee ID is required");
      }

      // Validate required fields with better error messages
      const requiredFields = {
        title: "Title",
        startTime: "Start Time",
        endTime: "End Time",
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field]) {
          throw new Error(`${label} is required`);
        }
      }

      // Convert dates and validate
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("Invalid date format");
      }

      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }

      // Format the schedule data
      const scheduleData = {
        title: formData.title.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: formData.location?.trim() || "",
        employeeId: Number(employeeId), // Ensure employeeId is a number
      };

      let response;
      if (currentSchedule) {
        response = await scheduleService.updateSchedule(
          currentSchedule.scheduleId,
          scheduleData
        );
      } else {
        response = await scheduleService.createSchedule(scheduleData);
      }

      if (!response) {
        throw new Error("No response received from server");
      }

      await loadSchedules();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving schedule:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save schedule";
      alert(errorMessage);
    }
  };

  const handleDelete = async (scheduleId) => {
    await scheduleService.deleteSchedule(scheduleId);
    loadSchedules();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      startTime: new Date(),
      endTime: new Date(),
      location: "",
    });
    setCurrentSchedule(null);
  };

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate the starting day of the week (0-6, where 0 is Sunday)
    const startDay = monthStart.getDay();

    // Add empty cells for days before the start of the month
    const emptyCells = Array(startDay).fill(null);

    return (
      <Grid container spacing={1}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Paper
              sx={{
                p: 1,
                textAlign: "center",
                bgcolor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              {day}
            </Paper>
          </Grid>
        ))}

        {emptyCells.map((_, index) => (
          <Grid item xs={12 / 7} key={`empty-${index}`}>
            <Paper
              sx={{
                p: 1,
                minHeight: 100,
                bgcolor: "var(--paper-bg)",
                color: "var(--text-primary)",
              }}
            />
          </Grid>
        ))}

        {days.map((day) => (
          <Grid item xs={12 / 7} key={day.toString()}>
            <Paper
              sx={{
                p: 1,
                minHeight: 100,
                cursor: "pointer",
                bgcolor: "var(--paper-bg)",
                color: "var(--text-primary)",
                "&:hover": {
                  bgcolor: "var(--button-hover)",
                },
              }}
              onClick={() => {
                setSelectedDate(day);
                setOpenDialog(true);
              }}
            >
              <Typography>{format(day, "d")}</Typography>
              {schedules
                .filter((s) => isSameDay(new Date(s.startTime), day))
                .map((schedule) => (
                  <div
                    key={schedule.scheduleId}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSchedule(schedule);
                      setFormData({
                        title: schedule.title,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        location: schedule.location,
                      });
                      setOpenDialog(true);
                    }}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "#ffffff",
                      padding: "4px 8px",
                      marginBottom: "4px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {schedule.title}
                  </div>
                ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  const formatDateTime = (date) => {
    return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          mb: 2,
        }}
      >
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeftIcon
            sx={{
              color: "var(--primary-color)",
              fontSize: "2rem",
            }}
          />
        </IconButton>
        <Typography variant="h5">
          {format(selectedDate, "MMMM yyyy")}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon
            sx={{
              color: "var(--primary-color)",
              fontSize: "2rem",
            }}
          />
        </IconButton>
      </Box>

      {renderCalendar()}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "var(--text-primary)",
            bgcolor: "var(--bg-color)",
          }}
        >
          {currentSchedule ? "Edit Schedule" : "New Schedule"}
        </DialogTitle>
        <DialogContent
          sx={{
            color: "var(--text-primary)",
            bgcolor: "var(--bg-color)",
          }}
        >
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={formatDateTime(formData.startTime)}
            onChange={(e) =>
              setFormData({ ...formData, startTime: new Date(e.target.value) })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={formatDateTime(formData.endTime)}
            onChange={(e) =>
              setFormData({ ...formData, endTime: new Date(e.target.value) })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions
          sx={{
            color: "var(--text-primary)",
            bgcolor: "var(--bg-color)",
          }}
        >
          {currentSchedule && (
            <Button
              onClick={() => handleDelete(currentSchedule.scheduleId)}
              color="error"
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeScheduleCalendar;
