import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import "./EmployeePage.css";
import SamagraSection from "./form-sections/SamagraSection";
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import EmploymentSection from "./form-sections/EmploymentSection";
import { useEmployeeForm } from "./hooks/useEmployeeForm";

const AddEmployeeForm = ({ onSave, onCancel }) => {
  const {
    formData,
    departments,
    samagraLoaded,
    emptyFields,
    photoPreview,
    isLoading,
    dialogOpen,
    dialogMessage,
    errorColor,
    handleChange,
    handleSamagraData,
    getFieldHelperText,
    validateForm,
    setDialogOpen,
    textFieldStyles,
  } = useEmployeeForm();

  return (
    <div className="form-container">
      <h2>Add Employee</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formatDate = (date) => {
            if (!date) return "";
            // If already in YYYY-MM-DD, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
            // Try to parse and format
            const d = new Date(date);
            if (isNaN(d)) return "";
            return d.toISOString().slice(0, 10);
          };
          const dataToSubmit = {
            ...formData,
            salary: Number(formData.salary),
            departmentId: Number(formData.departmentId),
            samagraId: Number(formData.samagraId),
            trainingRequired: Boolean(formData.trainingRequired),
            DOB: formatDate(formData.DOB),
          };

          if (!validateForm(dataToSubmit)) {
            return;
          }

          onSave(dataToSubmit);
        }}
      >
        <SamagraSection
          formData={formData}
          onChange={handleChange}
          onFetchSamagra={handleSamagraData}
          isLoading={isLoading}
          textFieldProps={textFieldStyles}
        />

        <PersonalInfoSection
          formData={formData}
          onChange={handleChange}
          samagraLoaded={samagraLoaded}
          emptyFields={emptyFields}
          getFieldHelperText={getFieldHelperText}
          textFieldProps={textFieldStyles}
          photoPreview={photoPreview}
        />

        <EmploymentSection
          formData={formData}
          departments={departments}
          onChange={handleChange}
          textFieldProps={textFieldStyles}
        />

        <div
          className="button-group"
          style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="save-btn"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </div>
      </form>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "var(--bg-color)",
            color: "var(--color)",
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid var(--color)" }}>
          Samagra Data Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: errorColor,
              marginTop: 2,
            }}
          >
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: "var(--color)",
              "&:hover": {
                backgroundColor: "rgba(var(--color-rgb), 0.1)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEmployeeForm;
