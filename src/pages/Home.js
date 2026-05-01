import React, { useState } from "react";
import "../App.css";
import Admission from "./Admission";
import { Link } from "react-router-dom";

<Link to="/courses">Courses</Link>



function Home() {
  const [showForm, setShowForm] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      id: 1,
      title: "About Us",
      desc: "Cybeorch Institute focuses on Cybersecurity, Ethical Hacking, Cyber Defense.",
    },
    {
      id: 2,
      title: "Batch Timings",
      desc: "Weekdays (Alternate Days) - 6 Hours Weekly | Weekends Available",
    },
    {
      id: 3,
      title: "Programs Offered",
      desc: "3-Month Certificate, 6-Month Certificate, 1-Year Diploma",
    },
    {
      id: 4,
      title: "Key Highlights",
      desc: "Live Classes, Real Projects, Certification Support, Placement Help",
    },
    {
      id: 5,
      title: "Entrance Exam",
      desc: "14 May 2026 - Certificate | 15 May 2026 - Diploma (Online Mode)",
    },
  ];

  return (
    <div>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>🔐 Build Your Career in Cybersecurity</h1>
        <p>
          Join industry-ready online certification & diploma programs with flexible batches and real-world training.
        </p>

        <div className="buttons">
          
          <button>Book Entrance Test</button>
          <button>Download Brochure</button>
        </div>

        {showForm && <Admission />}
      </div>

      {/* HORIZONTAL CARDS SECTION */}
      <div className="container py-4">
        <h2 className="text-center mb-4">📚 Institute Information</h2>

        <div className="d-flex overflow-auto gap-3 pb-3">

          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() =>
                setActiveCard(activeCard === card.id ? null : card.id)
              }
              className={`flip-card ${
                activeCard === card.id ? "active-card" : ""
              }`}
            >

              <div className="flip-inner">

                {/* FRONT SIDE */}
                <div className="flip-front">
                  <h4>{card.title}</h4>
                  <p>Click to view</p>
                </div>

                {/* BACK SIDE */}
                <div className="flip-back">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
 <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We provide quality education and skill-based learning to help students
            build a successful career.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
  <li><Link to="/courses">Courses</Link></li>
  <li><Link to="/admission">Admission</Link></li>
  <li><Link to="/contact">Contact</Link></li>
</ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@example.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Pune, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Your Company. All rights reserved.</p>
      </div>
    </footer>
  
    </div>
    
  );
}

export default Home;