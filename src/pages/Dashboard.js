import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignments, setAssignments] = useState([])
  
  const [myCourse, setMyCourse] = useState({
  name: "No course selected",
  description: "No description"
});


const [courses, setCourses] = useState([]);
  

  const [form, setForm] = useState({
  name: "",
  description: ""
});// 🔥 NEW: description state



const [liveClasses, setLiveClasses] = useState([]);

useEffect(() => {
  if (user?.email) {
    fetch(`http://localhost:5000/my-course/${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMyCourse({
  name: data.course || "No course selected",
  description: data.description || "No description"
});
        } else {
          setMyCourse({
            name: "No course selected",
            description: "No description"
          });
        }
      });
  }
}, [user]);


const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

    
 

 const [liveForm, setLiveForm] = useState({
  title: "",
  link: "",
  course: "",   // ✅ course_id नाही
  description: ""
});

  // courses fetch
  useEffect(() => {
    axios.get("http://localhost:5000/courses")
      .then((res) => setCourses(res.data));
  }, []);

  

  
  
//assignment uplad
 

  const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select file");
    return;
  }

  const formData = new FormData();
  formData.append("student_id", "101");
  formData.append("file", selectedFile);

  try {
    

    alert("Upload successful ✅");
  } catch (err) {
    console.log(err);
    alert("Upload failed ❌");
  }
};

 

  // LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email.trim(),   // 🔥 trim important
        password: form.password,
      }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data); // 🔥 DEBUG

    if (data.success) {
      setIsLoggedIn(true);
      setUser(data.user);

      // 🔥 Save email (Admission form + API use)
      localStorage.setItem("email", data.user.email);

      // 🔥 DIRECT course set (instant UI update)
      if (data.user.course) {
        setMyCourse({
  name: data.user.course || "",
  description: data.user.description || ""
});
      } else {
        setMyCourse({
  name: "No course selected",
  description: "No description"
});
      }

    } else {
      if (data.message === "EMAIL_NOT_FOUND") {
        alert("Account nahi aahe, signup kara");
        setPage("signup");
      } else if (data.message === "WRONG_PASSWORD") {
        alert("Password chukicha aahe");
      } else {
        alert("Login failed");
      }
    }
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    alert("Server connect nahi ❌");
  }
};
    
   

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful");
        setPage("login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Server error ❌");
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!form.email) {
      alert("Enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("Server error ❌");
    }
  };

  // LOGIN / SIGNUP UI
  if (!isLoggedIn) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2>🎓 Student Portal</h2>

          <div style={styles.toggle}>
            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("signup")}>Signup</button>
          </div>

          {page === "login" && (
            <form onSubmit={handleLogin}>
              <input
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <p
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setPage("forgot")}
              >
                Forgot Password?
              </p>

              <button style={styles.button} type="submit">
                Login
              </button>
            </form>
          )}

          {page === "forgot" && (
            <div style={styles.card}>
              <h2>🔐 Forgot Password</h2>

              <input
                style={styles.input}
                placeholder="Enter Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <button
                style={styles.button}
                onClick={handleForgotPassword}
              >
                Send Reset Link
              </button>

              <p
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => setPage("login")}
              >
                Back to Login
              </p>
            </div>
          )}

          {page === "signup" && (
            <form onSubmit={handleSignup}>
              <input
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={form.password}
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

  return (
    <div className="dashboard-container">
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

      <div className="content">
        {active === "home" && (
          <h2>Welcome {user?.name} 🎓</h2>
        )}

       {active === "courses" && (
  <>
    <h2>📚 Your Course: {myCourse?.name || "No course selected"}</h2>
<p>📝 Description: {myCourse?.description || "No description"}</p>
  </>
)}

       {active === "live" && (
  <>
    <h2>🎥 Live Classes</h2>

  

      


    {/* 🔥 STUDENT LIVE CLASSES */}
    <div>
      <h3>Your Live Classes</h3>

      {liveClasses.length === 0 ? (
        <p>No live classes</p>
      ) : (
        liveClasses.map((cls) => (
          <div key={cls.id}>
            <h4>{cls.title}</h4>
            <a href={cls.link} target="_blank">
              Join Class
            </a>
            <p>{cls.date_time}</p>
          </div>
        ))
      )}
    </div>
  </>
)}
        {active === "assign" && (
  <div>
    <h2>📝 Assignments</h2>

    <div>
      <h2>📚 Upload Assignment</h2>

     <input
  type="file"
  onChange={(e) => setSelectedFile(e.target.files[0])}
/>

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  </div>
)}
  

        {active === "exam" && <h2>🧪 Exams</h2>}
        {active === "result" && <h2>📊 Results</h2>}
        {active === "cert" && <h2>🏆 Certificate</h2>}
      </div>
    </div>
  );
}

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