import React, { useState } from "react";
import "../App.css";
import Admission from "./Admission";

function Home() {
  const [showForm, setShowForm] = useState(false);
  

  return (
    <div>

      {/* ✅ ONLY FIXED BUTTON */}


      {/* HERO */}
      <div className="hero">
        <h1>🔐 Build Your Career in Cybersecurity</h1>
        <p>
          Join industry-ready online certification & diploma programs with flexible batches and real-world training.
        </p>

        <div className="buttons">
          <button onClick={() => setShowForm(true)}>
          Apply Now
          </button>

          <button>Book Entrance Test</button>
          <button>Download Brochure</button>
        </div>
<div style={{
  textAlign: "center",
  marginTop: "40px",
  background: "#0a0925",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)"
}}>
  <h2>📂 Projects & Assignments</h2>

  <ul style={{
    display: "inline-block",
    textAlign: "left",
    marginTop: "15px"
  }}>
    <li>✔ Weekly assignments for practice</li>
    <li>✔ Real-world cybersecurity projects</li>
    <li>✔ Final project submission mandatory</li>
    <li>✔ Certification only after project completion</li>
  </ul>
</div>
        
        {showForm && <Admission />}
      </div>

      {/* ABOUT */}
      <div className="section">
        <h2>About Us</h2>
        <p>
          Cybeorch Institute of Cybersecurity is a next-generation learning platform focused on Digital & Physical Security Systems, Ethical Hacking, and Cyber Defense.
        </p>

        <ul>
          <li>Industry-relevant curriculum</li>
          <li>Live online classes</li>
          <li>Practical training & assignments</li>
          <li>Flexible batch timings</li>
        </ul>
      </div>

      {/* BATCH TIMINGS */}
      <div className="section">
        <h2>⏰ Batch Timings</h2>

        <h3>📅 Weekdays (Alternate Days)</h3>
        <p>Total: 6 Hours Weekly</p>

        <h3>📅 Weekend Batches</h3>
        <p>Saturday & Sunday</p>
      </div>

      {/* PROGRAMS */}
      <div className="section">
        <h2>Programs Offered</h2>
        <ul>
          <li>3-Month Certificate Course</li>
          <li>6-Month Certificate Course</li>
          <li>1-Year Diploma in Cybersecurity</li>
        </ul>
      </div>

      {/* HIGHLIGHTS */}
      <div className="section">
        <h2>Key Highlights</h2>
        <ul>
          <li>100% Online Learning</li>
          <li>Weekly Classes</li>
          <li>Real Projects</li>
          <li>Certification Support</li>
        </ul>
      </div>

      {/* EXAM */}
      <div className="section exam">
        <h2>Entrance Exam</h2>
        <p>14 May 2026 – Certificate Course</p>
        <p>15 May 2026 – PG Diploma</p>
        <p>Mode: Online</p>
      </div>

    </div>
  );
}

export default Home;