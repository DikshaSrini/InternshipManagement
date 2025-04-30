import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

// Calculate match percentage
const techMatchScore = (required, preferences = []) =>
  (required.filter(tech => preferences.includes(tech)).length / required.length) * 100;

// Drag item
const InternDragItem = ({ intern, projectRequiredTech }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "intern",
    item: { internId: intern.id, projectRequiredTech },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const eligibilityPercentage = techMatchScore(projectRequiredTech, intern.preferences || []);

  return (
    <div
      ref={drag}
      style={{
        padding: "15px",
        margin: "8px 0",
        backgroundColor: isDragging ? "#f0f0f0" : "#1e2a49",
        cursor: "move",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    >
      <div style={{ fontWeight: "bold", color: "#f1f1f1" }}>{intern.name}</div>
      <div style={{ color: "#f1f1f1", marginTop: "5px" }}>
        Eligibility: {eligibilityPercentage.toFixed(2)}%
      </div>
      <div style={{ color: "#777", marginTop: "5px" }}>
        Preferences: {intern.preferences?.join(", ") || "No preferences available"}
      </div>
    </div>
  );
};

const ProjectAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [manualAssignments, setManualAssignments] = useState({});

  useEffect(() => {
    // Load initial data
    fetch("http://localhost:5000/api/projects").then(res => res.json()).then(setProjects);
    fetch("http://localhost:5000/api/interns").then(res => res.json()).then(setInterns);
    
    // Fetch assignments
    fetch("http://localhost:5000/api/assignments").then(res => res.json()).then(data => {
      setAssignments({}); // <- Set empty initially
      setManualAssignments(data.manual || {});
    });
  }, []);
  

  const handleAutoAssign = () => {
    const newAssignments = {};
    projects.forEach(project => {
      const rankedInterns = interns
        .map(intern => ({
          id: intern.id,
          name: intern.name,
          match: techMatchScore(project.requiredTech, intern.preferences || []),
        }))
        .filter(i => i.match > 0)
        .sort((a, b) => b.match - a.match);
      
      newAssignments[project.id] = rankedInterns;
    });
    
    // Save auto assignments to backend
    fetch("http://localhost:5000/api/assignments/autoAssignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auto: newAssignments }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save auto assignments");
        return res.text();
      })
      .then(() => {
        setAssignments(newAssignments);
      })
      .catch(err => {
        console.error("Error saving auto assignments:", err);
        alert("Error saving auto assignments");
      });
  };

  const handleManualAssign = (projectId, internId) => {
    const updatedAssignments = { ...manualAssignments };
    if (!updatedAssignments[projectId]) updatedAssignments[projectId] = [];
    if (!updatedAssignments[projectId].includes(internId)) {
      updatedAssignments[projectId].push(internId);
    }
    
    // Save manual assignments to backend
    fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ manual: { [projectId]: updatedAssignments[projectId] } }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save manual assignment");
        return res.text();
      })
      .then(() => {
        setManualAssignments(updatedAssignments);
      })
      .catch(err => {
        console.error("Error saving manual assignment:", err);
        alert("Error saving manual assignment");
      });
  };

  const downloadCSV = () => {
    // Fetch processed data from backend for export
    fetch("http://localhost:5000/api/assignments/export")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch export data");
        return res.json();
      })
      .then(exportData => {
        const rows = [];
        const headers = [
          "Project ID",
          "Project Name",
          "Auto-Matched Interns (Name)",
          "Auto-Match %",
          "Manual-Matched Interns (Name)"
        ];
        rows.push(headers.join(","));

        exportData.forEach(project => {
          const autoNames = project.autoAssigned.map(i => i.name).join("; ");
          const autoPercents = project.autoAssigned.map(i => i.match.toFixed(2)).join("; ");
          const manualNames = project.manualAssigned.map(i => i.name).join("; ");

          rows.push([
            project.projectId,
            project.projectName,
            autoNames,
            autoPercents,
            manualNames
          ].join(","));
        });

        const csvContent = rows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "intern_assignments.csv";
        link.click();
      })
      .catch(err => {
        console.error("Error downloading CSV:", err);
        alert("Error generating CSV export");
      });
  };

  const ManualAssignmentArea = ({ projectId }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "intern",
      drop: (item) => handleManualAssign(projectId, item.internId),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div
        ref={drop}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          height: "400px",
          border: "1px solid #1c74d4",
          padding: "10px",
          marginTop: "10px",
          backgroundColor: isOver ? "#4e73df" : "#2a3a5f",
          borderRadius: "8px",
        }}
      >
        <p style={{ color: "#f1f1f1" }}>Drag Interns from the right into this space to manually assign them to the project.</p>
        <h4 style={{ color: "#f1f1f1" }}>Assigned Interns:</h4>
        <ul style={{ color: "#f1f1f1" }}>
          {manualAssignments[projectId]?.map(internId => {
            const intern = interns.find(i => i.id === internId);
            return intern ? <li key={internId}>{intern.name}</li> : null;
          })}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#0b1d3a", color: "#f1f1f1", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>Project Assignment Dashboard</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={handleAutoAssign}
          style={{
            backgroundColor: "#1c74d4",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Auto-Assign Interns
        </button>
        <button
          onClick={downloadCSV}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Download CSV
        </button>
      </div>

      {projects.map(project => (
        <div
          key={project.id}
          style={{
            border: "1px solid #2e3a5c",
            margin: "20px 0",
            padding: "10px",
            display: "flex",
            backgroundColor: "#1e2a49",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>{project.title}</h3>
            <p>Required: {project.requiredTech.join(", ")}</p>

            <h4>Auto-Assigned Interns:</h4>
            <ul>
              {assignments[project.id]?.map(intern => (
                <li key={intern.id}>
                  {intern.name} - {intern.match.toFixed(0)}%
                </li>
              ))}
            </ul>

            <h4>Manual Assignment (Drag Interns Here):</h4>
            <ManualAssignmentArea projectId={project.id} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              padding: "10px",
              marginLeft: "20px",
              backgroundColor: "#2a3a5f",
              border: "1px solid #1c74d4",
              borderRadius: "8px",
            //   overflowY: "auto",
            //   maxHeight: "400px",
            }}
          >
            <h4>Available Interns (Drag Here):</h4>
            {interns.map(intern => (
              <InternDragItem
                key={intern._id}
                intern={intern}
                projectRequiredTech={project.requiredTech}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectAssignment;