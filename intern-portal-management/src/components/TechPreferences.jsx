import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const TechPreferences = ({ onSubmit }) => {
  const [selectedTechStacks, setSelectedTechStacks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [internName, setInternName] = useState("");  // Changed from selectedInternId
  const [loading, setLoading] = useState(true);

  const techOptions = [
    "React", "Vue", "Angular", "Node.js", "Python",
    "Django", "Ruby on Rails", "PHP", "Java", "Go"
  ].map(tech => ({ label: tech, value: tech }));

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/interns');
        const data = await res.json();
        setInterns(data);
      } catch (err) {
        console.error('Error fetching interns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!internName.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Optional: Find intern ID by matching name (if needed)
    const matchedIntern = interns.find(intern => intern.name.toLowerCase() === internName.trim().toLowerCase());

    if (!matchedIntern) {
      alert("Intern name not found. Please enter a valid name.");
      return;
    }

    const updatedPreferences = {
      internId: matchedIntern._id,
      preferences: selectedTechStacks.map(option => option.value)
    };

    try {
      const response = await fetch("http://localhost:5000/api/interns/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPreferences)
      });

      if (response.ok) {
        alert("Preferences updated successfully!");
        onSubmit && onSubmit(updatedPreferences);
      } else {
        alert("Failed to update preferences.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("There was an error updating your preferences.");
    }
  };

  if (loading) return <div>Loading intern data...</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Set Your Tech Preferences</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Enter your name:</label>
        <input
          type="text"
          value={internName}
          onChange={(e) => setInternName(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          placeholder="Type your full name..."
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Select preferred tech stacks:</label>
        <Select
          options={techOptions}
          isMulti
          onChange={setSelectedTechStacks}
          value={selectedTechStacks}
          placeholder="Choose technologies..."
        />
      </div>

      <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
    </form>
  );
};

export default TechPreferences;
