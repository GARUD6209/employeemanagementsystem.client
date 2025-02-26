import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import AttendanceService from "../../services/AttendanceService";
import { useAuth } from "../../contexts/AuthContext";
import { EmployeeService } from "../../services/EmployeeService";

const EmployeeAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const attendanceService = new AttendanceService();
  const [employeeId, setEmployeeId] = useState("");
  const { userId } = useAuth();
  const employeeService = new EmployeeService();

  useEffect(() => {
    // Fetch employeeId when the component mounts
    const fetchEmployeeId = async () => {
      const id = await employeeService.getEmployeeIdByUserId(userId);
      setEmployeeId(id);
    };
    fetchEmployeeId();
  }, [userId, employeeService]);

  const columns = [
    {
      title: "Date",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Check In",
      dataIndex: "checkIn",
      key: "checkInTime",
      render: (text) => new Date(text).toLocaleTimeString(),
    },
    {
      title: "Check Out",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (text) => (text ? new Date(text).toLocaleTimeString() : "-"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  useEffect(() => {
    fetchAttendance();
  }, [employeeId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceByEmployeeId(
        employeeId
      );
      setAttendanceList(data);
    } catch (error) {
      message.error("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const attendance = {
        employeeId: employeeId,
        checkIn: new Date().toISOString(),
        status: "Present",
      };
      await attendanceService.createAttendance(attendance);
      message.success("Check-in successful");
      fetchAttendance();
    } catch (error) {
      message.error("Check-in failed");
    }
  };

  return (
    <div
      className="attendance-container"
      style={{ padding: "var(--spacing-lg)" }}
    >
      <div
        style={{
          marginBottom: "var(--spacing-md)",
          background: "var(--color-background-secondary)",
          padding: "var(--spacing-md)",
          borderRadius: "var(--border-radius)",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <h2
          style={{
            color: "var(--color-text-primary)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Attendance Management
        </h2>
        <Button
          type="primary"
          onClick={handleCheckIn}
          style={{
            background: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            marginBottom: "var(--spacing-sm)",
          }}
        >
          Check In
        </Button>
      </div>
      <Table
        dataSource={attendanceList}
        columns={columns}
        loading={loading}
        rowKey="attendanceId"
        style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius)",
          boxShadow: "var(--box-shadow)",
        }}
        pagination={{
          pageSize: 10,
          style: { color: "var(--color-text-primary)" },
        }}
      />
    </div>
  );
};

export default EmployeeAttendance;
