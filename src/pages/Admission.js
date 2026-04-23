import React, { useState, useMemo } from "react";
import "./Admission.css";

export default function Admission({
  selectedCourse = "Not Selected",
  onSubmitSuccess,
}) {
  const course = selectedCourse || "Not Selected";

  // STUDENT ID
  const generateStudentId = () => {
    return "STU" + Date.now();
  };

  // COURSE ID
  const generateCourseId = (courseName) => {
    if (!courseName || courseName === "Not Selected") {
      return "COURSE_DEFAULT";
    }

    return (
      courseName.slice(0, 3).toUpperCase().replace(/\s/g, "") +
      Date.now()
    );
  };

  const studentId = useMemo(() => generateStudentId(), []);
  const courseId = useMemo(() => generateCourseId(course), [course]);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    mobile: "",
    address: "",
    qualification: "",
    batch: "",
  });

  const [paymentFile, setPaymentFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setPaymentFile(e.target.files[0]);
  };

  // 🔥 MYSQL SAVE FUNCTION (ADDED)
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("studentId", studentId);
    formDataToSend.append("courseId", courseId);
    formDataToSend.append("course", course);

    formDataToSend.append("name", formData.name);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("qualification", formData.qualification);
    formDataToSend.append("batch", formData.batch);

    formDataToSend.append("payment", paymentFile);

    fetch("http://localhost:5000/admission", {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SERVER RESPONSE:", data);

        if (data.success) {
          alert("🎉 Admission Submitted Successfully!");

          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        } else {
          alert("❌ Failed to submit");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server Error");
      });

    // RESET FORM
    setFormData({
      name: "",
      dob: "",
      gender: "",
      email: "",
      mobile: "",
      address: "",
      qualification: "",
      batch: "",
    });

    setPaymentFile(null);
  };

  return (
    <div className="admission-container">

      <h2>🎓 Admission Form</h2>

      <div className="idBox">
        <p><b>Student ID:</b> {studentId}</p>
        <p><b>Course ID:</b> {courseId}</p>
        <p><b>Course:</b> {course}</p>
      </div>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          name="qualification"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={handleChange}
          required
        />

        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        >
          <option value="">Select Batch</option>
          <option>Morning</option>
          <option>Evening</option>
        </select>

        <label>Payment Screenshot:</label>
        <input type="file" onChange={handleFile} required />

        <button type="submit">Submit Admission</button>

      </form>
    </div>
  );
}