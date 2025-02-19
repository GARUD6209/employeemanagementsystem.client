import { useNavigate } from "react-router-dom";

function LogoutLink({ setAuthorized, setUserRole }) {
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
        //ccfsvd
        navigate("/");
      } else {
        console.error("Error logging out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <a href="#" onClick={handleLogoutSubmit}>
      Logout
    </a>
  );
}

export default LogoutLink;
