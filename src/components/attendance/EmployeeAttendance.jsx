import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceService from "../../services/AttendanceService";
import { useAuth } from "../../contexts/AuthContext";
import { getCurrentTimeISO } from "../../utils/dateUtils"; // Import the utility function

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "var(--bg-color)",
  color: "var(--text-color)",
  borderRadius: "8px",
  marginBottom: "20px",
  padding: "24px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const StyledTableContainer = styled(TableContainer)({
  "& .MuiTable-root": {
    backgroundColor: "var(--bg-color)",
  },
  "& .MuiTableHead-root": {
    backgroundColor: "var(--table-header-bg)",
  },
  "& .MuiTableCell-root": {
    color: "var(--text-color)",
    borderBottom: "1px solid var(--table-border)",
  },
  "& .MuiTableRow-root:hover": {
    backgroundColor: "var(--table-hover)",
  },
  "& .MuiTablePagination-root": {
    color: "var(--text-color)",
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "var(--primary-color)",
  color: "#fff",
  "&:hover": {
    backgroundColor: "var(--primary-color)",
    opacity: 0.9,
  },
  "&.Mui-disabled": {
    backgroundColor: "var(--text-secondary)",
    color: "var(--bg-color)",
    opacity: 0.6,
  },
}));

const EmployeeAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const attendanceService = new AttendanceService();
  const { userId, employeeId } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
      checkTodayAttendance();
    }
  }, [employeeId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceByEmployeeId(
        employeeId
      );
      // Sort by latest first
      const sortedData = [...data].sort(
        (a, b) => new Date(b.checkIn) - new Date(a.checkIn)
      );
      setAttendanceList(sortedData);
    } catch (error) {
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      if (!employeeId) return;

      const data = await attendanceService.getAttendanceByEmployeeId(
        employeeId
      );
      const today = new Date().toDateString();
      const todayRecord = data.find(
        (att) => new Date(att.checkIn).toDateString() === today
      );

      setTodayAttendance(todayRecord || null);
    } catch (error) {
      message.error("Failed to check today's attendance");
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!employeeId) {
        message.error("Employee ID not found");
        return;
      }

      if (todayAttendance) {
        message.warning("You have already checked in today");
        return;
      }

      const attendance = {
        employeeId: employeeId,
        checkIn: getCurrentTimeISO(), // Use the utility function here
        status: "Present",
      };

      console.log("Attempting check-in with data:", attendance);
      const response = await attendanceService.createAttendance(attendance);
      console.log("Check-in response:", response);

      setTodayAttendance(response);
      message.success("Check-in successful");
      fetchAttendance();
    } catch (error) {
      console.error("Check-in failed:", error);
      message.error("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) {
      message.warning("You haven't checked in today");
      return;
    }

    if (todayAttendance.checkOut) {
      message.warning("You have already checked out today");
      return;
    }

    try {
      await attendanceService.updateCheckOutStatus(
        todayAttendance.attendanceId,
        getCurrentTimeISO() // Use the utility function here
      );
      message.success("Check-out successful");
      checkTodayAttendance();
      fetchAttendance();
    } catch (error) {
      message.error("Check-out failed");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLatestAttendance = () => {
    if (attendanceList.length === 0) return null;
    return attendanceList[0]; // First item is the latest due to sorting
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <StyledPaper elevation={2}>
        <Typography
          variant="h5"
          sx={{
            color: "var(--text-color)",
            mb: 3,
            fontWeight: 500,
          }}
        >
          Attendance Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <StyledButton
            variant="contained"
            onClick={handleCheckIn}
            disabled={todayAttendance !== null}
            sx={{ minWidth: "120px" }}
          >
            {todayAttendance ? "Already Checked In" : "Check In"}
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleCheckOut}
            disabled={!todayAttendance || todayAttendance?.checkOut}
            sx={{
              minWidth: "120px",
              backgroundColor: "var(--success-color)",
              "&:hover": {
                backgroundColor: "var(--success-hover-color)",
              },
            }}
          >
            {todayAttendance?.checkOut ? "Already Checked Out" : "Check Out"}
          </StyledButton>
        </Box>
      </StyledPaper>

      {/* Latest Update Section */}
      {getLatestAttendance() && (
        <StyledPaper elevation={2} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "var(--text-color)" }}>
            Latest Attendance Record
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Date
              </Typography>
              <Typography>
                {new Date(getLatestAttendance().checkIn).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Check In
              </Typography>
              <Typography>
                {new Date(getLatestAttendance().checkIn).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Check Out
              </Typography>
              <Typography>
                {getLatestAttendance().checkOut
                  ? new Date(
                      getLatestAttendance().checkOut
                    ).toLocaleTimeString()
                  : "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Typography>{getLatestAttendance().status}</Typography>
            </Box>
          </Box>
        </StyledPaper>
      )}

      <StyledPaper elevation={2}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.attendanceId}>
                    <TableCell>
                      {new Date(row.checkIn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(row.checkIn).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {row.checkOut
                        ? new Date(row.checkOut).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={attendanceList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </StyledTableContainer>
      </StyledPaper>
    </Box>
  );
};

export default EmployeeAttendance;
