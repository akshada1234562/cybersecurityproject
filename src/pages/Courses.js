import React, { useState } from "react";
import "./Courses.css";
import "../App.css";
import Admission from "./Admission";

function Courses() {

  const [selectedCourse, setSelectedCourse] = useState("");
  const [showForm, setShowForm] = useState(false);

  // 👉 Apply button click function
  const handleApplyClick = (e, courseName) => {
    e.stopPropagation(); // card click थांबवण्यासाठी

    localStorage.setItem("selectedCourse", courseName); // Store selected course in localStorage
    setSelectedCourse(courseName);
    setShowForm(true);
  };

  return (
    <div className="section">

      <h1>📚 Our Courses</h1>

      {/* 3 Month Course */}
      <div 
        className={`course-card ${selectedCourse === "3-MONTH CERTIFICATE COURSE" ? "active" : ""}`}
        onClick={() => setSelectedCourse("3-MONTH CERTIFICATE COURSE")}
      >
        <h2>🎓 3-Month Certificate Course</h2>
        <p><b>Duration:</b> 3 Months</p>

        <h4>Modules:</h4>
        <ul>
          <li>Basics of Cybersecurity</li>
          <li>Computer Hardware & Networking</li>
          <li>Operating Systems Fundamentals</li>
          <li>Introduction to Ethical Hacking</li>
          <li>Cyber Threats & Attacks</li>
          <li>Digital Safety Practices</li>
        </ul>

        <h4>Outcome:</h4>
        <p>Foundation-level cybersecurity knowledge</p>

        {selectedCourse === "3-MONTH CERTIFICATE COURSE" && (
          <button onClick={(e) => handleApplyClick(e, "3-MONTH CERTIFICATE COURSE")}>
            Apply Now
          </button>
        )}
      </div>

      {/* 6 Month Course */}
      <div 
        className={`course-card ${selectedCourse === "6-MONTH CERTIFICATE COURSE" ? "active" : ""}`}
        onClick={() => setSelectedCourse("6-MONTH CERTIFICATE COURSE")}
      >
        <h2>🎓 6-Month Certificate Course</h2>
        <p><b>Duration:</b> 6 Months</p>

        <h4>Modules:</h4>
        <ul>
          <li>Advanced Networking</li>
          <li>Ethical Hacking (Intermediate)</li>
          <li>Web Application Security</li>
          <li>System Security & Firewalls</li>
          <li>Malware Analysis Basics</li>
          <li>Digital & Physical Security Systems</li>
        </ul>

        <h4>Outcome:</h4>
        <p>Industry-ready skills</p>

        {selectedCourse === "6-MONTH CERTIFICATE COURSE" && (
          <button onClick={(e) => handleApplyClick(e, "6-MONTH CERTIFICATE COURSE")}>
            Apply Now
          </button>
        )}
      </div>

      {/* 1 Year Course */}
      <div 
        className={`course-card ${selectedCourse === "1-YEAR PG DIPLOMA" ? "active" : ""}`}
        onClick={() => setSelectedCourse("1-YEAR PG DIPLOMA")}
      >
        <h2>🎓 1-Year PG Diploma</h2>
        <p><b>Duration:</b> 12 Months</p>

        <h4>Modules:</h4>
        <ul>
          <li>Advanced Ethical Hacking</li>
          <li>Penetration Testing</li>
          <li>Cyber Forensics</li>
          <li>Cloud Security</li>
          <li>AI in Cybersecurity</li>
          <li>Enterprise Security Architecture</li>
          <li>Security Operations (SOC)</li>
        </ul>

        <h4>Outcome:</h4>
        <p>Professional cybersecurity expert</p>

        {selectedCourse === "1-YEAR PG DIPLOMA" && (
          <button onClick={(e) => handleApplyClick(e, "1-YEAR PG DIPLOMA")}>
            Apply Now
          </button>
        )}
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowForm(false)}>✖</span>

            {/* 👉 इथे function pass केलं */}
            <Admission
  selectedCourse={selectedCourse}
  onSubmitSuccess={() => {
    setShowForm(false);
    setSelectedCourse("");
  }}
/>

          </div>
        </div>
      )}

    </div> 
  );
}

export default Courses;