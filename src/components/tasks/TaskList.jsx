import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { TaskStatus } from "../../models/taskAssignment.model";

const TaskList = ({
  tasks,
  isAdmin,
  onStatusUpdate,
  onFileDownload,
  onFileUpload,
}) => {
  const renderActionButtons = (task) => {
    if (task.status === TaskStatus.Completed) {
      return null;
    }

    return (
      <Stack direction="row" spacing={1}>
        {task.status === TaskStatus.Pending && (
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => onStatusUpdate(task.id, TaskStatus.InProgress)}
          >
            Start Task
          </Button>
        )}
        {task.status === TaskStatus.InProgress && (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onStatusUpdate(task.id, TaskStatus.Completed)}
            >
              Complete
            </Button>
            <Button
              variant="contained"
              component="label"
              size="small"
              color="secondary"
            >
              Upload Output
              <input
                type="file"
                hidden
                onChange={(e) => onFileUpload(task.id, e)}
              />
            </Button>
          </>
        )}
      </Stack>
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "var(--paper-bg)",
        "& .MuiTableHead-root": {
          "& .MuiTableCell-head": {
            backgroundColor: "var(--table-header-bg)",
            color: "var(--text-primary)",
            fontWeight: "bold",
          },
        },
        "& .MuiTableCell-root": {
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        },
        "& .MuiTableRow-root:hover": {
          backgroundColor: "var(--hover-bg)",
        },
        "& .MuiIconButton-root": {
          color: "var(--text-primary)",
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {isAdmin && <TableCell>Employee Name</TableCell>}
            <TableCell>Description</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Files</TableCell>
            {!isAdmin && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              {isAdmin && <TableCell>{task.employeeName}</TableCell>}
              <TableCell>{task.description}</TableCell>
              <TableCell>{new Date(task.deadline).toLocaleString()}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {task.inputFilePath && (
                    <Button
                      startIcon={<Download />}
                      onClick={() =>
                        onFileDownload(task.inputFilePath, "input")
                      }
                      variant="outlined"
                      size="small"
                    >
                      Input
                    </Button>
                  )}
                  {task.outputFilePath && (
                    <Button
                      startIcon={<Download />}
                      onClick={() =>
                        onFileDownload(task.outputFilePath, "output")
                      }
                      variant="outlined"
                      size="small"
                    >
                      Output
                    </Button>
                  )}
                </Stack>
              </TableCell>
              {!isAdmin && <TableCell>{renderActionButtons(task)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskList;
