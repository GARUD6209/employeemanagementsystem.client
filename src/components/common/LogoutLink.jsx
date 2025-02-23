import { useNavigate } from "react-router-dom";

function LogoutLink({ setAuthorized, setUserRole, children }) {
  const navigate = useNavigate();

  const handleLogoutSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setAuthorized(false);
        setUserRole("");
        navigate("/");
      } else {
        console.error("Error logging out");
      }
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
