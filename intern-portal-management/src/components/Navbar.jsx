import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: "#1e2a49", padding: "1rem" }}>
      <ul style={{
        display: "flex",
        listStyle: "none",
        margin: 0,
        padding: 0,
        justifyContent: "center",
        gap: "2rem",
        color: "white"
      }}>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/">Intern List</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/add">Add Intern</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/poll">Tech Poll</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/stats">Stats</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/assign">Project Assignment</Link></li> 
      </ul>
    </nav>
  );
};

export default Navbar;
