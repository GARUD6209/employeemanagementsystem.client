import React, { useState, useEffect } from "react";
import { message } from "antd";
import * as XLSX from "xlsx";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceService from "../../services/AttendanceService";
import CustomDatePicker from "../common/CustomDatePicker";

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

const AdminAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [employeeIdForExport, setEmployeeIdForExport] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const attendanceService = new AttendanceService();

  useEffect(() => {
    handleDateChange(selectedDate);
  }, []);

  const handleEmployeeExport = async () => {
    if (!employeeIdForExport.trim() || isNaN(employeeIdForExport)) {
      message.error("Please enter a valid Employee ID");
      return;
    }

    try {
      setLoading(true);
      message.loading("Fetching attendance data...");

      const data = await attendanceService.getAttendanceByEmployeeId(
        parseInt(employeeIdForExport)
      );
      console.log("Processed attendance data:", data); // Debug log

      if (!data || data.length === 0) {
        message.warning("No attendance records found for this employee");
        return;
      }

      const excelData = [
        ["Employee ID", "Date", "Check In Time", "Check Out Time", "Status"],
      ];

      data.forEach((record) => {
        try {
          const checkIn = record.checkIn ? new Date(record.checkIn) : null;
          const checkOut = record.checkOut ? new Date(record.checkOut) : null;

          excelData.push([
            record.employeeId || employeeIdForExport,
            checkIn ? checkIn.toLocaleDateString() : "N/A",
            checkIn ? checkIn.toLocaleTimeString() : "N/A",
            checkOut ? checkOut.toLocaleTimeString() : "Not checked out",
            record.status || "N/A",
          ]);
        } catch (err) {
          console.error("Error processing record:", record, err);
        }
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Records");

      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `employee_${employeeIdForExport}_attendance_${timestamp}.xlsx`;

      XLSX.writeFile(wb, fileName);
      message.success("Attendance report downloaded successfully");
    } catch (error) {
      console.error("Export error details:", error);
      message.error(error.message || "Failed to generate attendance report");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
    handleDateChange(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
    handleDateChange(nextDate);
  };

  const handleDateChange = async (date) => {
    if (!date) return;

    try {
      setLoading(true);
      const formattedDate = date.toISOString().split("T")[0];
      const data = await attendanceService.getAttendanceByDay(formattedDate);
      // Sort by check-in time in descending order (latest first)
      const sortedData = [...data].sort(
        (a, b) => new Date(b.checkIn) - new Date(a.checkIn)
      );
      setAttendanceList(sortedData);
      setSelectedDate(date);
    } catch (error) {
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const getLatestAttendance = () => {
    if (attendanceList.length === 0) return null;
    return attendanceList[0]; // First item is the latest due to sorting
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          Attendance Overview
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "var(--text-color)",
          }}
        >
          <Button onClick={handlePreviousDay} sx={{ minWidth: "40px", p: 1 }}>
            <ArrowBackIos />
          </Button>
          <CustomDatePicker value={selectedDate} onChange={handleDateChange} />
          <Button onClick={handleNextDay} sx={{ minWidth: "40px", p: 1 }}>
            <ArrowForwardIos />
          </Button>
        </Box>
      </StyledPaper>

      {/* Latest Update Section */}
      {getLatestAttendance() && (
        <StyledPaper elevation={2} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "var(--text-color)" }}>
            Latest Update
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Employee ID
              </Typography>
              <Typography>{getLatestAttendance().employeeId}</Typography>
            </Box>
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

      <StyledPaper elevation={2} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "var(--text-color)" }}>
          Export Employee Attendance
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <TextField
            label="Employee ID"
            value={employeeIdForExport}
            onChange={(e) =>
              setEmployeeIdForExport(e.target.value.replace(/\D/g, ""))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--input-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-color)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-color)",
              },
              "& .MuiInputBase-input": {
                color: "var(--text-color)",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleEmployeeExport}
            disabled={!employeeIdForExport || isNaN(employeeIdForExport)}
            sx={{
              bgcolor: "var(--primary-color)",
              "&:hover": {
                bgcolor: "var(--primary-color-dark)",
              },
            }}
          >
            Download Excel
          </Button>
        </Box>
      </StyledPaper>

      <StyledPaper elevation={2}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
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
                    <TableCell>{row.employeeId}</TableCell>
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

export default AdminAttendance;
