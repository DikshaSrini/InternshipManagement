import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ backgroundColor: "#1e2a49", padding: "1rem" }}>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          margin: 0,
          padding: 0,
          justifyContent: "center",
          gap: "2rem",
          color: "white",
        }}
      >
        <li>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Intern List
          </Link>
        </li>
        {user && user.role === "admin" && (
          <>
            <li>
              <Link style={{ color: "white", textDecoration: "none" }} to="/add">
                Add Intern
              </Link>
            </li>
            <li>
              <Link style={{ color: "white", textDecoration: "none" }} to="/assign">
                Project Assignment
              </Link>
            </li>
          </>
        )}

        <li>
          <Link style={{ color: "white", textDecoration: "none" }} to="/stats">
            Stats
          </Link>
        </li>

        {user ? (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link style={{ color: "white", textDecoration: "none" }} to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link style={{ color: "white", textDecoration: "none" }} to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
