import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import InternList from "./components/InternList";
import AddIntern from "./components/AddIntern";
import TechPreferences from "./components/TechPreferences";
import TechStats from "./components/TechStats";
import ProjectAssignment from "./components/ProjectAssignment";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [interns, setInterns] = useState([]);
  const location = useLocation(); // ✅ Get current path

  const fetchInterns = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/interns");
      const data = await response.json();
      setInterns(data);
    } catch (error) {
      console.error("Error fetching interns:", error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handlePollSubmit = () => {
    fetchInterns();
  };

  return (
    <>
      {/* ✅ Show Navbar only if NOT on login/signup */}
      {!["/login", "/signup"].includes(location.pathname) && <Navbar />}
      
      <Routes>
        <Route path="/" element={<InternList interns={interns} />} />
        <Route path="/add" element={<AddIntern setInterns={setInterns} />} />
        <Route
          path="/poll"
          element={<TechPreferences interns={interns} onSubmit={handlePollSubmit} />}
        />
        <Route path="/stats" element={<TechStats interns={interns} />} />
        <Route path="/assign" element={<ProjectAssignment interns={interns} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
