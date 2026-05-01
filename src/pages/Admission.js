import React, { useState, useMemo } from "react";
import "./Admission.css";
import axios from "axios";


export default function Admission({ selectedCourse, userEmail, onSubmitSuccess }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
let storedCourse = null;

try {
  storedCourse = JSON.parse(localStorage.getItem("selectedCourse"));
} catch (e) {
  storedCourse = null;
}
const course = storedCourse?.name || "Not Selected";
const courseObject = storedCourse || null;

const description =
  storedCourse?.description || "Basics of Cybersecurity + Networking";


  // STUDENT ID
  const generateStudentId = () => {
    return "STU" + Date.now();
  };

  

  

  // COURSE ID
  const generateCourseId = (courseName) => {
  if (!courseName || courseName === "Not Selected") {
    return "COURSE_DEFAULT";
  }

  // 🔥 if object comes from localStorage
  const name = typeof courseName === "object"
    ? courseName.name
    : courseName;

  return (
    name.slice(0, 3).toUpperCase().replace(/\s/g, "") +
    Date.now()
  );
};

  const studentId = useMemo(() => generateStudentId(), []);
  const courseId = useMemo(() => generateCourseId(course), [course]);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: userEmail || "",  // 🔥 PRE-FILL EMAIL IF AVAILABLE
    password: "",
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

  const handlePayment = () => {
  const options = {
    key: "rzp_test_SgT5EWmTYjVQEU",
    amount: 1500,
    currency: "INR",
    name: "Cybersecurity Institute",
    description: "Entrance Exam Fee",

  handler: async function (response) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Login required");
      return;
    }

    await axios.post("http://localhost:5000/api/payment-success", {
      paymentId: response.razorpay_payment_id,
      status:"success",
      amount: 1500,
      userId: user.id
    });

    alert("Payment Successful & Saved ✅");
  },  // ✅ IMPORTANT comma

  theme: {
    color: "#3399cc"
  }
};

const rzp = new window.Razorpay(options);
rzp.open();

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
    formDataToSend.append("password", formData.password);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("qualification", formData.qualification);
    formDataToSend.append("batch", formData.batch);
    formDataToSend.append("description", description);

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
      password: "",
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
<p><b>Description:</b> {description}</p>
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
  value={formData.email}
  readOnly
/>

       <input
  name="password"
  placeholder="Password"
  type="password"
  value={formData.password}
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


        <button type="button" onClick={handlePayment}>
  💳 Pay Entrance Exam Fee ($15)
</button>

      </form>
    </div>
  );
}