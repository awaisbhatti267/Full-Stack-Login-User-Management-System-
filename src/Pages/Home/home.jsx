//Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import Table from "../../Component/Table/table";
import "./home.css";

const Home = () => {
  const API = "http://127.0.0.1:5000/get-user";
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // ✅ hook for redirection

  const fetchUser = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched DATA:", data);

      // Merge both tables if they exist
      const mergedData = [...(data.emptable || []), ...(data.empdata || [])];

      if (mergedData.length > 0) {
        setUsers(mergedData);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchUser(API);
  }, []);

  // ✅ Sign out function
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove login data
    setTimeout(() => navigate("/"), 1000); // redirect to login page
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Python Flask API → React JS Integration</h1>
        {/* ✅ Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* ✅ Display Table */}
      <Table users={users} />
    </div>
  );
};

export default Home;
