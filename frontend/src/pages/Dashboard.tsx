import { useNavigate } from "react-router-dom";
import { useAuth } from  "../auth/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate()
  
  const { user, logout } = useAuth()
  
  const handleLogout = ()=> {
    logout()
    navigate("/login")
  }

  return (
    <div>
      <h1>IntelliStock AI</h1>

      <h2>Welcone, {user?.name}</h2>
      <p>{user?.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;