import React from "react";
import { Grid, TextField, Button, CircularProgress } from "@mui/material";

const SamagraSection = ({
  formData,
  onChange,
  onFetchSamagra,
  isLoading,
  textFieldProps,
}) => {
  return (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Samagra ID"
          name="samagraId"
          value={formData.samagraId || ""}
          onChange={onChange}
          required
          variant="outlined"
          fullWidth
          {...textFieldProps}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onFetchSamagra}
          disabled={isLoading}
          sx={{
            height: "56px",
            minWidth: "180px",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Fetch Samagra Data"
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export default SamagraSection;
