import React, { useState } from "react";
import "./Courses.css";
import "../App.css";
import Admission from "./Admission";

function Courses() {

  const [selectedCourse, setSelectedCourse] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleApplyClick = (e, courseName, description) => {
    e.stopPropagation();

    const courseData = {
      name: courseName,
      description: description,
    };

    localStorage.setItem("selectedCourse", JSON.stringify(courseData));

    setSelectedCourse(courseName);
    setShowForm(true);
  };

  return (
    <div className="container py-4">

      <h1 className="text-center mb-4">📚 Our Courses</h1>

      {/* FLEX + BOOTSTRAP ROW */}
      <div className="row justify-content-center g-4 courses-container">

        {/* 3 Month Course */}
        <div
          className={`col-md-4 course-card card shadow-lg p-3 ${
            selectedCourse === "3-MONTH CERTIFICATE COURSE" ? "active" : ""
          }`}
          onClick={() => setSelectedCourse("3-MONTH CERTIFICATE COURSE")}
        >
          <h4>🎓 3-Month Certificate Course</h4>
          <p><b>Duration:</b> 3 Months</p>

          <h6>Modules:</h6>
          <ul>
            <li>Basics of Cybersecurity</li>
            <li>Computer Hardware & Networking</li>
            <li>Operating Systems Fundamentals</li>
            <li>Ethical Hacking Intro</li>
            <li>Cyber Threats</li>
            <li>Digital Safety</li>
          </ul>

          <p><b>Outcome:</b> Foundation knowledge</p>

          {selectedCourse === "3-MONTH CERTIFICATE COURSE" && (
            <button
              className="btn btn-dark"
              onClick={(e) =>
                handleApplyClick(
                  e,
                  "3-MONTH CERTIFICATE COURSE",
                  "Basics of Cybersecurity + Networking"
                )
              }
            >
              Apply Now
            </button>
          )}
        </div>

        {/* 6 Month Course */}
        <div
          className={`col-md-4 course-card card shadow-lg p-3 ${
            selectedCourse === "6-MONTH CERTIFICATE COURSE" ? "active" : ""
          }`}
          onClick={() => setSelectedCourse("6-MONTH CERTIFICATE COURSE")}
        >
          <h4>🎓 6-Month Certificate Course</h4>
          <p><b>Duration:</b> 6 Months</p>

          <h6>Modules:</h6>
          <ul>
            <li>Advanced Networking</li>
            <li>Ethical Hacking</li>
            <li>Web Security</li>
            <li>Firewall Systems</li>
            <li>Malware Basics</li>
            <li>Digital Security</li>
          </ul>

          <p><b>Outcome:</b> Industry-ready skills</p>

          {selectedCourse === "6-MONTH CERTIFICATE COURSE" && (
            <button
              className="btn btn-dark"
              onClick={(e) =>
                handleApplyClick(
                  e,
                  "6-MONTH CERTIFICATE COURSE",
                  "Advanced Ethical Hacking + Web Security"
                )
              }
            >
              Apply Now
            </button>
          )}
        </div>

        {/* 1 Year Course */}
        <div
          className={`col-md-4 course-card card shadow-lg p-3 ${
            selectedCourse === "1-YEAR PG DIPLOMA" ? "active" : ""
          }`}
          onClick={() => setSelectedCourse("1-YEAR PG DIPLOMA")}
        >
          <h4>🎓 1-Year PG Diploma</h4>
          <p><b>Duration:</b> 12 Months</p>

          <h6>Modules:</h6>
          <ul>
            <li>Advanced Ethical Hacking</li>
            <li>Penetration Testing</li>
            <li>Cyber Forensics</li>
            <li>Cloud Security</li>
            <li>AI in Cybersecurity</li>
            <li>SOC Operations</li>
          </ul>

          <p><b>Outcome:</b> Professional expert</p>

          {selectedCourse === "1-YEAR PG DIPLOMA" && (
            <button
              className="btn btn-dark"
              onClick={(e) =>
                handleApplyClick(
                  e,
                  "1-YEAR PG DIPLOMA",
                  "Penetration Testing + Cloud + SOC"
                )
              }
            >
              Apply Now
            </button>
          )}
        </div>

      </div>

      {/* ✅ ANIMATED POPUP */}
      {showForm && (
        <div className="popup-overlay" onClick={() => setShowForm(false)}>

          <div className="popup-box" onClick={(e) => e.stopPropagation()}>

            <span className="close" onClick={() => setShowForm(false)}>✖</span>

            <Admission
              selectedCourse={selectedCourse}
              userEmail={localStorage.getItem("email")}
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