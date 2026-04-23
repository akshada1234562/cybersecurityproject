import React, { useState } from "react";

export default function Dashboard() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [active, setActive] = useState("home");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    if (form.email && form.password) {
      setIsLoggedIn(true);
    } else {
      alert("Enter email and password");
    }
  };

  // SIGNUP
  const handleSignup = (e) => {
    e.preventDefault();

    if (form.name && form.email && form.password) {
      alert("Signup Successful! Now login");
      setPage("login");
    } else {
      alert("Fill all fields");
    }
  };

  // 🔴 LOGIN / SIGNUP CARD
  if (!isLoggedIn) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>🎓 Student Portal</h2>

          {/* Toggle Buttons */}
          <div style={styles.toggle}>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("signup")}>Signup</button>
          </div>

          {/* LOGIN */}
          {page === "login" && (
            <form onSubmit={handleLogin}>
              <input
                style={styles.input}
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button style={styles.button} type="submit">
                Login
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {page === "signup" && (
            <form onSubmit={handleSignup}>
              <input
                style={styles.input}
                placeholder="Name"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button style={styles.button} type="submit">
                Signup
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 🟢 DASHBOARD AFTER LOGIN
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🎓 Student Panel</h2>

        <button onClick={() => setActive("home")}>🏠 Home</button>
        <button onClick={() => setActive("courses")}>📚 Courses</button>
        <button onClick={() => setActive("live")}>🎥 Live Class</button>
        <button onClick={() => setActive("assign")}>📝 Assignments</button>
        <button onClick={() => setActive("exam")}>🧪 Exams</button>
        <button onClick={() => setActive("result")}>📊 Results</button>
        <button onClick={() => setActive("cert")}>🏆 Certificate</button>
      </div>

      {/* CONTENT */}
      <div className="content">
        {active === "home" && <h2>Welcome Student 🎓</h2>}
        {active === "courses" && <h2>📚 Courses: 3-MONTH CERTIFICATE COURSE, 6-Month Certificate Course,1-Year PG Diploma in Cybersecurity</h2>}
        {active === "live" && <h2>🎥 Live Class Link</h2>}
        {active === "assign" && <h2>📝 Upload Assignment</h2>}
        {active === "exam" && <h2>🧪 Exams Section</h2>}
        {active === "result" && <h2>📊 Results Section</h2>}
        {active === "cert" && <h2>🏆 Certificate Download</h2>}
      </div>
    </div>
  );
}

// 🎨 STYLES (IMPORTANT – error fix)
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f1f5f9",
  },

  card: {
    width: "320px",
    padding: "20px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    textAlign: "center",
    background: "white",
  },

  toggle: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  input: {
    width: "90%",
    padding: "10px",
    margin: "8px 0",
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#4a90e2",
    color: "white",
    border: "none",
    marginTop: "10px",
    cursor: "pointer",
  },
};