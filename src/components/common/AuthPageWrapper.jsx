import { Box } from "@mui/material";

const AuthPageWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px", // Height of the AppBar
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("/src/assets/background-image.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
        zIndex: 0,
      }}
    >
      {children}
    </Box>
  );
};

export default AuthPageWrapper;
