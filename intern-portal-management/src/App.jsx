import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import InternList from "./components/InternList";
import AddIntern from "./components/AddIntern";
import TechPreferences from "./components/TechPreferences";
import TechStats from "./components/TechStats";
import ProjectAssignment from "./components/ProjectAssignment"; // ✅ New import
import Navbar from "./components/Navbar";

function App() {
  const [interns, setInterns] = useState([]);

  // Fetch interns from the backend
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
    // After submitting preferences, fetch latest data
    fetchInterns();
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<InternList interns={interns} />} />
        <Route path="/add" element={<AddIntern setInterns={setInterns} />} />
        <Route path="/poll" element={<TechPreferences interns={interns} onSubmit={handlePollSubmit} />} />
        <Route path="/stats" element={<TechStats interns={interns} />} />
        <Route path="/assign" element={<ProjectAssignment interns={interns} />} /> {/* ✅ New Route */}
      </Routes>
    </>
  );
}

export default App;
