import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditIntern = ({ interns }) => {
  const { id } = useParams();  // Get the intern ID from the URL
  const navigate = useNavigate();
  const [internData, setInternData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Fetch the intern details based on the ID
    const intern = interns.find((intern) => intern._id === id);
    setInternData(intern);
  }, [id, interns]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedInternData = { ...internData };

    // If an image file is selected, convert it to base64 and add it to intern data
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedInternData = { ...updatedInternData, image: reader.result };
        updateInternInDB(updatedInternData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      updateInternInDB(updatedInternData);
    }
  };

  const updateInternInDB = async (updatedInternData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/interns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInternData),
      });

      if (response.ok) {
        alert("Intern updated successfully!");
        navigate("/"); // Redirect to the intern list page
      } else {
        alert("Error updating intern.");
      }
    } catch (error) {
      console.error("Error updating intern:", error);
      alert("Error updating intern.");
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setInternData({ ...internData, skills });
  };

  const handleSocialLinksChange = (platform, e) => {
    const updatedSocialLinks = internData.socialLinks.map((link) =>
      link.platform === platform ? { ...link, url: e.target.value } : link
    );
    setInternData({ ...internData, socialLinks: updatedSocialLinks });
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (!internData) {
    return <p>Loading intern data...</p>;  // Show loading while fetching intern details
  }

  return (
    <div style={{ backgroundColor: "#1a2a3b", minHeight: "100vh", padding: "3rem", color: "white" }}>
      <h1 style={{ textAlign: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        Edit Intern
      </h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#1f3c58", padding: "2rem", borderRadius: "8px" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Name:</label>
          <input
            type="text"
            value={internData.name}
            onChange={(e) => setInternData({ ...internData, name: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Position:</label>
          <input
            type="text"
            value={internData.position}
            onChange={(e) => setInternData({ ...internData, position: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Institution:</label>
          <input
            type="text"
            value={internData.institution}
            onChange={(e) => setInternData({ ...internData, institution: e.target.value })}
            required
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Skills (comma-separated):</label>
          <input
            type="text"
            value={internData.skills.join(", ")}
            onChange={handleSkillsChange}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Social Links:</label>
          {internData.socialLinks.map((link, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <label style={{ fontWeight: "bold", display: "block" }}>{link.platform} URL:</label>
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleSocialLinksChange(link.platform, e)}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  fontSize: "1rem",
                  backgroundColor: "#273a56",
                  border: "1px solid #3e5c7b",
                  borderRadius: "4px",
                  color: "white",
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Duration:</label>
          <input
            type="text"
            value={internData.duration}
            onChange={(e) => setInternData({ ...internData, duration: e.target.value })}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Description:</label>
          <input
            type="text"
            value={internData.description}
            onChange={(e) => setInternData({ ...internData, description: e.target.value })}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Status:</label>
          <select
            value={internData.status}
            onChange={(e) => setInternData({ ...internData, status: e.target.value })}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          >
            <option value="Available">Available</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Waiting for Full-Time">Waiting for Full-Time</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Fun Fact:</label>
          <input
            type="text"
            value={internData.funFact}
            onChange={(e) => setInternData({ ...internData, funFact: e.target.value })}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>Upload Image:</label>
          <input
            type="file"
            onChange={handleImageUpload}
            style={{
              width: "100%",
              padding: "0.8rem",
              fontSize: "1rem",
              backgroundColor: "#273a56",
              border: "1px solid #3e5c7b",
              borderRadius: "4px",
              color: "white",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "1rem 2rem",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          Update Intern
        </button>
      </form>
    </div>
  );
};

export default EditIntern;
