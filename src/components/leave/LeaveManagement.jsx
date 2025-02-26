import React from "react";

import { useAuth } from "../../contexts/AuthContext";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { LeaveRequestList } from "./LeaveRequestList";

export const LeaveManagement = () => {
  const auth = useAuth();

  if (!auth) {
    return <div className="container mt-4">Authentication not available</div>;
  }

  const { userRole, loading, authorized } = auth;

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (!authorized) {
    return (
      <div className="container mt-4">Please log in to access this page.</div>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <div className="container mt-4">
      <h2>Leave Management</h2>

      {!isAdmin && (
        <div className="mb-4">
          <h3>Submit Leave Request</h3>
          <LeaveRequestForm
            onSubmitSuccess={() => {
              window.location.reload();
            }}
          />
        </div>
      )}

      <div className="mt-4">
        <h3>Leave Requests</h3>
        <LeaveRequestList />
      </div>
    </div>
  );
};
