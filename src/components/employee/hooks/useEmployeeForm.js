import { useState, useEffect } from "react";
import { DepartmentService } from "../../../services/DepartmentService";
import { RegisterUserModel } from "../../../models/RegisterUserModel";
import SamagraService from "../../../services/SamagraService";

const textFieldStyles = {
  InputLabelProps: {
    style: { color: "var(--color)" },
  },
  InputProps: {
    style: { color: "var(--color)" },
  },
  sx: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color)",
    },
    "& .Mui-disabled": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color) !important",
        opacity: 0.5,
      },
      "& input": {
        color: "var(--color) !important",
        opacity: 0.8,
        WebkitTextFillColor: "var(--color) !important",
      },
      "& .MuiInputLabel-root": {
        color: "var(--color) !important",
        opacity: 0.8,
      },
    },
  },
};

export const useEmployeeForm = () => {
  const [formData, setFormData] = useState(new RegisterUserModel());
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [samagraLoaded, setSamagraLoaded] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [errorColor, setErrorColor] = useState("");

  const departmentService = new DepartmentService();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData };
      switch (name) {
        case "departmentId":
        case "salary":
        case "samagraId":
          newData[name] = value === "" ? "" : Number(value);
          break;
        case "trainingRequired":
          newData[name] = value === "true";
          break;
        default:
          if (name.startsWith("is") || name.startsWith("has")) {
            newData[name] = value === "true";
          } else {
            newData[name] = value;
          }
      }
      return newData;
    });
  };

  const validateForm = (dataToSubmit) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "contact",
      "jobRole",
      "departmentId",
      "role",
      "samagraId",
      "salary",
    ];

    const missingFields = requiredFields.filter(
      (field) => !dataToSubmit[field]
    );

    if (missingFields.length > 0) {
      setDialogMessage(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      setErrorColor("var(--warning-color)");
      setDialogOpen(true);
      return false;
    }
    return true;
  };

  const handleSamagraData = async () => {
    const samagraId = Number(formData.samagraId);
    if (!samagraId || isNaN(samagraId) || samagraId <= 0) {
      setDialogMessage("Please enter a valid Samagra ID");
      setErrorColor("var(--warning-color)");
      setDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const samagraData = await SamagraService.getSamagraData(
        String(samagraId)
      );

      if (!samagraData || samagraData.status === 0) {
        setDialogMessage(
          samagraData?.msgData || "Unable to fetch Samagra data for this ID"
        );
        setErrorColor("var(--warning-color)");
        setDialogOpen(true);
        return;
      }

      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? dateStr : d.toISOString().slice(0, 10);
      };

      const emptyFieldsList = [];
      const checkAndTrackEmpty = (value, fieldName) => {
        if (!value || value.trim() === "") {
          emptyFieldsList.push(fieldName);
          return "";
        }
        return value;
      };
      const photoData = samagraData.msgData.photo;
      // For preview only, we'll add the data URL prefix if needed
      const previewUrl =
        photoData && !photoData.startsWith("data:image")
          ? `data:image/jpeg;base64,${photoData}`
          : photoData;
      setPhotoPreview(photoData); // Store raw data for form submission

      const newFormData = {
        ...formData,
        photo: photoData,
        firstName: checkAndTrackEmpty(
          samagraData.msgData.firstName,
          "First Name"
        ),
        lastName: checkAndTrackEmpty(samagraData.msgData.lastName, "Last Name"),
        FatherName: checkAndTrackEmpty(
          samagraData.msgData.fatherName,
          "Father's Name"
        ),
        MotherName: checkAndTrackEmpty(
          samagraData.msgData.motherName,
          "Mother's Name"
        ),
        Gender: checkAndTrackEmpty(samagraData.msgData.gender, "Gender"),
        MaritalStatus: checkAndTrackEmpty(
          samagraData.msgData.maritalStatus,
          "Marital Status"
        ),
        DOB: checkAndTrackEmpty(
          formatDate(samagraData.msgData.dob),
          "Date of Birth"
        ),
        District: checkAndTrackEmpty(samagraData.msgData.district, "District"),
        address: checkAndTrackEmpty(samagraData.msgData.address, "Address"),
        contact: checkAndTrackEmpty(samagraData.msgData.contact, "Contact"),
        email: checkAndTrackEmpty(samagraData.msgData.email, "Email"),
      };

      setFormData(newFormData);
      setEmptyFields(emptyFieldsList);
      setSamagraLoaded(true);

      if (emptyFieldsList.length > 0) {
        setDialogMessage(
          `Successfully fetched Samagra data but some fields are empty: ${emptyFieldsList.join(
            ", "
          )}. Please fill them manually.`
        );
        setErrorColor("var(--success-color)");
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch Samagra data:", error);
      setDialogMessage(
        error.response?.data?.msgData ||
          error.response?.data?.errCode ||
          "Failed to fetch Samagra data."
      );
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldHelperText = (fieldName) => {
    if (!samagraLoaded) return "";

    const displayName = fieldName
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());

    return (fieldName === "DOB" && emptyFields.includes("Date of Birth")) ||
      emptyFields.includes(displayName)
      ? "Not available in Samagra data"
      : "";
  };
  return {
    formData,
    departments,
    loading,
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
  };
};
