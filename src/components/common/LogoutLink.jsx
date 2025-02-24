import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function LogoutLink({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutSubmit = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <a
      href="#"
      onClick={handleLogoutSubmit}
      style={{
        textDecoration: "none",
        color: "var(--text-color)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </a>
  );
}

export default LogoutLink;
