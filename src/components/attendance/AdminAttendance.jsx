import React, { useState } from "react";
import { DatePicker, message } from "antd";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceService from "../../services/AttendanceService";
// ...existing imports...

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

const StyledDatePicker = styled(DatePicker)({
  width: "250px",
  marginBottom: "16px",
  "& .ant-picker": {
    backgroundColor: "var(--bg-color)",
    borderColor: "var(--input-border)",
    color: "var(--text-color)",
  },
  "& .ant-picker-input > input": {
    color: "var(--text-color)",
  },
  "& .ant-picker-suffix": {
    color: "var(--text-secondary)",
  },
});

const AdminAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const attendanceService = new AttendanceService();

  const handleDateChange = async (date) => {
    if (!date) return;

    try {
      setLoading(true);
      const formattedDate = date.format("YYYY-MM-DD");
      const data = await attendanceService.getAttendanceByDay(formattedDate);
      setAttendanceList(data);
    } catch (error) {
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
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
        <StyledDatePicker
          onChange={handleDateChange}
          placeholder="Select date"
          sx={{ color: "var(--text-color)", bgcolor: "var(--bg-color)" }}
        />
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
