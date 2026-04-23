import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Admission from "./pages/Admission";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Router>

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">CYBEORCH</h2>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/admission">Admission</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>

      {/* ROUTES */}
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />

        {/* ADMISSION */}
        <Route
          path="/admission"
          element={
            submitted ? (
              <div className="successBox">
                <h2>🎓 Admission Submitted Successfully!</h2>
                <button onClick={() => setSubmitted(false)}>
                  Apply Again
                </button>
              </div>
            ) : (
              <Admission onSubmitSuccess={() => setSubmitted(true)} />
            )
          }
        />

      </Routes>

    </Router>
  );
}

export default App;