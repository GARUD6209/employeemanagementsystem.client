import React from "react";
import { TextField, Grid } from "@mui/material";

const PersonalInfoSection = ({
  formData,
  onChange,
  samagraLoaded,
  emptyFields,
  getFieldHelperText,
  textFieldProps,
  photoPreview,
}) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "var(--color)", marginBottom: "1rem" }}>
        Personal Information
      </h3>
      <Grid container spacing={2}>
        {/* Photo Preview */}
        {photoPreview && (
          <Grid item xs={12}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <img
                src={
                  photoPreview?.startsWith("data:image")
                    ? photoPreview
                    : `data:image/jpeg;base64,${photoPreview}`
                }
                alt="Employee"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  border: "2px solid var(--color)",
                  objectFit: "contain",
                }}
              />
            </div>
          </Grid>
        )}

        {/* First Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("First Name")}
            error={samagraLoaded && emptyFields.includes("First Name")}
            helperText={getFieldHelperText("firstName")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Last Name")}
            error={samagraLoaded && emptyFields.includes("Last Name")}
            helperText={getFieldHelperText("lastName")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Father's Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Father's Name"
            name="FatherName"
            value={formData.FatherName || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Father's Name")}
            error={samagraLoaded && emptyFields.includes("Father's Name")}
            helperText={getFieldHelperText("FatherName")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Mother's Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mother's Name"
            name="MotherName"
            value={formData.MotherName || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Mother's Name")}
            error={samagraLoaded && emptyFields.includes("Mother's Name")}
            helperText={getFieldHelperText("MotherName")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Gender"
            name="Gender"
            value={formData.Gender || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Gender")}
            error={samagraLoaded && emptyFields.includes("Gender")}
            helperText={getFieldHelperText("Gender")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Marital Status */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Marital Status"
            name="MaritalStatus"
            value={formData.MaritalStatus || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Marital Status")}
            error={samagraLoaded && emptyFields.includes("Marital Status")}
            helperText={getFieldHelperText("MaritalStatus")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Date of Birth */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Birth"
            type="date"
            name="DOB"
            value={formData.DOB || ""}
            onChange={(e) =>
              onChange({
                target: {
                  name: "DOB",
                  value: e.target.value,
                },
              })
            }
            required
            disabled={samagraLoaded && !emptyFields.includes("Date of Birth")}
            error={samagraLoaded && emptyFields.includes("Date of Birth")}
            helperText={getFieldHelperText("DOB")}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              ...textFieldProps.InputLabelProps,
              shrink: true,
            }}
            inputProps={{
              ...textFieldProps.InputProps,
              style: {
                ...textFieldProps.InputProps.style,
                colorScheme: "var(--calendar-color-scheme)",
              },
            }}
            sx={{
              ...textFieldProps.sx,
              "& input[type=date]::-webkit-calendar-picker-indicator": {
                filter: "var(--calendar-icon-filter)",
              },
            }}
          />
        </Grid>

        {/* District */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="District"
            name="District"
            value={formData.District || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("District")}
            error={samagraLoaded && emptyFields.includes("District")}
            helperText={getFieldHelperText("District")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Address")}
            error={samagraLoaded && emptyFields.includes("Address")}
            helperText={getFieldHelperText("address")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        {/* Contact */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact"
            name="contact"
            value={formData.contact || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9+\- ]/g, "");
              if (value.length <= 15) {
                onChange({
                  target: {
                    name: "contact",
                    value,
                  },
                });
              }
            }}
            required
            disabled={samagraLoaded && !emptyFields.includes("Contact")}
            error={
              (samagraLoaded && emptyFields.includes("Contact")) ||
              (formData.contact &&
                !/^[+]?[\d\- ]{10,15}$/.test(formData.contact))
            }
            helperText={
              samagraLoaded && emptyFields.includes("Contact")
                ? getFieldHelperText("contact")
                : formData.contact &&
                  !/^[+]?[\d\- ]{10,15}$/.test(formData.contact)
                ? "Please enter a valid phone number"
                : ""
            }
            variant="outlined"
            fullWidth
            {...textFieldProps}
            inputProps={{
              maxLength: 15,
              placeholder: "+91 1234567890",
            }}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={onChange}
            required
            disabled={samagraLoaded && !emptyFields.includes("Email")}
            error={samagraLoaded && emptyFields.includes("Email")}
            helperText={getFieldHelperText("email")}
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalInfoSection;
