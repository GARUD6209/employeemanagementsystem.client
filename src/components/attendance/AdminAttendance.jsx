import React, { useState } from "react";
import { Table, DatePicker, Space, message } from "antd";
import AttendanceService from "../../services/AttendanceService";

const AdminAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const attendanceService = new AttendanceService();

  const columns = [
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId" },
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

  return (
    <div
      className="admin-attendance-container"
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
          Attendance Overview
        </h2>
        <Space direction="vertical" className="mb-3">
          <DatePicker
            onChange={handleDateChange}
            placeholder="Select date"
            style={{
              width: "200px",
              borderColor: "var(--color-border)",
              borderRadius: "var(--border-radius-sm)",
            }}
          />
        </Space>
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

export default AdminAttendance;
