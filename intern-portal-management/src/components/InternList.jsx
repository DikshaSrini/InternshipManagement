import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import "./InternList.css";

const defaultImage = "https://via.placeholder.com/150";

const InternList = () => {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:5000/api/interns")
      .then((res) => res.json())
      .then((data) => {
        setInterns(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching interns:", err);
        setLoading(false);
      });
  }, []);

  const toggleView = () => setView(view === "card" ? "table" : "card");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;

    try {
      await fetch(`http://localhost:5000/api/interns/${id}`, {
        method: "DELETE",
      });

      setInterns((prev) => prev.filter((intern) => intern._id !== id));
      setSelectedIntern(null);
    } catch (error) {
      console.error("Failed to delete intern:", error);
    }
  };

  const handleEdit = (intern) => {
    navigate(`/edit-intern/${intern._id}`);
  };

  const roles = [...new Set(interns.map((i) => i.position))];

  const filteredInterns = interns
    .filter((intern) =>
      intern.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((intern) => (filter ? intern.position === filter : true))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const totalPages = Math.ceil(filteredInterns.length / itemsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <p>Loading interns...</p>;

  return (
    <main className="intern-list-container">
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button onClick={toggleView}>
          Switch to {view === "card" ? "Table View" : "Card View"}
        </button>
      </div>

      {view === "card" ? (
        selectedIntern ? (
          <section className="card-center">
            <button onClick={() => setSelectedIntern(null)} className="back-button">
              Back to List
            </button>
            <ProfileCard
              {...selectedIntern}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        ) : (
          <section className="intern-list">
            <h1>Intern Directory</h1>
            {interns.map((intern) => (
              <article
                key={intern._id}
                className="intern-item"
                onClick={() => setSelectedIntern(intern)}
              >
                <img
                  src={intern.image || defaultImage}
                  alt={intern.name || "Intern"}
                  className="intern-avatar"
                />
                <h3 className="intern-name">{intern.name}</h3>
                {/* Removed the Edit button here */}
              </article>
            ))}
          </section>
        )
      ) : (
        <section style={{ width: "100%", maxWidth: "800px" }}>
          <h2 style={{ textAlign: "center" }}>Intern Table</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="">All Roles</option>
              {roles.map((role, i) => (
                <option key={i} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              style={{
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #1c74d4",
                backgroundColor: "#1c74d4",
                color: "white",
                cursor: "pointer",
              }}
            >
              Sort by Name {sortAsc ? "↑" : "↓"}
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#1e2a49", color: "#fff" }}>
            <thead>
              <tr style={{ backgroundColor: "#2a3a5f" }}>
                <th style={tableHeader}>Name</th>
                <th style={tableHeader}>Position</th>
                <th style={tableHeader}>Institution</th>
                <th style={tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInterns.map((intern) => (
                <tr key={intern._id} style={{ borderBottom: "1px solid #444" }}>
                  <td style={tableCell}>{intern.name}</td>
                  <td style={tableCell}>{intern.position}</td>
                  <td style={tableCell}>{intern.institution}</td>
                  <td style={tableCell}>
                    <button onClick={() => handleEdit(intern)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                style={{
                  margin: "0 5px",
                  backgroundColor: page === idx + 1 ? "#1c74d4" : "#fff",
                  color: page === idx + 1 ? "#fff" : "#000",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const tableHeader = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tableCell = {
  padding: "10px",
};

export default InternList;
