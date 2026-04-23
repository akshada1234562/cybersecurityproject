import React, { useState, useEffect } from "react";

export default function Admin() {
  const [active, setActive] = useState("students");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [editData, setEditData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editQ, setEditQ] = useState(null);
  const [payments, setPayments] = useState([])
const [newQ, setNewQ] = useState({
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  answer: ""
});
  

  // -------------------- QUESTIONS --------------------

  const fetchQuestions = () => {
    fetch("http://localhost:5000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  };

  // ✅ ADD QUESTION
  const addQuestion = async () => {
    if (
      !newQ.question ||
      !newQ.option1 ||
      !newQ.option2 ||
      !newQ.option3 ||
      !newQ.option4 ||
      !newQ.answer
    ) {
      alert("All fields required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newQ)
      });

      const data = await res.json();

      alert(data.msg || "Question Added");

      fetchQuestions();

      setNewQ({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: ""
      });

    } catch (err) {
      alert("Error adding question");
    }
  };

  const deleteQuestion = async (id) => {
    await fetch(`http://localhost:5000/delete-question/${id}`, {
      method: "DELETE"
    });

    fetchQuestions();
  };

  useEffect(() => {
    if (active === "questions") fetchQuestions();
  }, [active]);

  const updateQuestion = async () => {
  await fetch(`http://localhost:5000/update-question/${editQ.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(editQ)
  });

  alert("Question Updated");

  setEditQ(null);
  fetchQuestions();
};


useEffect(() => {
  fetch("http://localhost:5000/payments")
    .then(res => res.json())
    .then(data => setPayments(data))
    .catch(err => console.log(err));
}, []);

  // -------------------- STUDENTS --------------------

  const fetchStudents = () => {
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    if (active === "students") fetchStudents();
  }, [active]);

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE"
    });

    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditData(student);
  };

  const updateStudent = async () => {
    await fetch(`http://localhost:5000/update/${editData.student_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editData)
    });

    alert("Updated Successfully");
    setEditData(null);
    fetchStudents();
  };

  //-------------------Payments-------------------

  // 1. Backend ला call करून order घे


  const payNow = async () => {
  try {
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST"
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_SgT5EWmTYjVQEU",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      // ✅ handler MUST be inside options
      handler: async function (response) {
        alert("Payment Successful ✅");

        console.log(response);

        await fetch("http://localhost:5000/save-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: 1,
            courseId: 101,
            course: "Java",
            studentName: "Akshada",
            email: "test@gmail.com",
            mobile: "9999999999",
            amount: order.amount,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            status: "PAID"
          })
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log(err);
    alert("Payment failed ❌");
  }
};
  

//--------------- EMAIL --------------------

 const sendEmail = async (student) => {
  if (!student.email) {
    alert("Email missing ❌");
    return;
  }

  if (!message) {
    alert("Message empty ❌");
    return;
  }

  const res = await fetch("http://localhost:5000/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: student.email,
      subject: "Exam Update",
      message: message
    })
  });

  const data = await res.json();
  alert(data.message);
};
<button
  onClick={() => {
    const email = document.getElementById("studentSelect").value;

    if (!email) {
      alert("Select student first ❌");
      return;
    }

    sendEmail({ email });
  }}
>
  Send Email
</button>

return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🛠 Admin Panel</h2>

        <button onClick={() => setActive("students")}>👨‍🎓 Students</button>
        <button onClick={() => setActive("payments")}>💰 Payments</button>
        <button onClick={() => setActive("exam")}>📚 Exam</button>
        <button onClick={() => setActive("questions")}>📚 Question Bank</button>
        <button onClick={() => setActive("email")}>Email</button>
        
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* STUDENTS */}
        {active === "students" && (
          <div>
            <h2>👨‍🎓 Student Management</h2>

            <table border="1" cellPadding="10">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course ID</th>
                  <th>Course</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Qualification</th>
                  <th>Batch</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="13">No Data Found</td>
                  </tr>
                ) : (
                  students.map((s, i) => (
                    <tr key={i}>
                      <td>{s.student_id}</td>
                      <td>{s.course_id}</td>
                      <td>{s.course}</td>
                      <td>{s.name}</td>
                      <td>{s.dob}</td>
                      <td>{s.gender}</td>
                      <td>{s.email}</td>
                      <td>{s.mobile}</td>
                      <td>{s.address}</td>
                      <td>{s.qualification}</td>
                      <td>{s.batch}</td>

                      <td>
                        {(s.payment || s.paymentFile) ? (
                          <img
                            src={`http://localhost:5000/uploads/${s.payment || s.paymentFile}`}
                            width="60"
                            alt="payment"
                          />
                        ) : "No File"}
                      </td>

                      <td>
                        <button onClick={() => handleEdit(s)}>✏️</button>
                        <button onClick={() => deleteStudent(s.student_id)}>❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
g
            {editData && (
              <div style={{ marginTop: "20px" }}>
                <h3>Edit Student</h3>

                <input value={editData.name}
                  onChange={(e)=>setEditData({...editData,name:e.target.value})} />

                <input value={editData.email}
                  onChange={(e)=>setEditData({...editData,email:e.target.value})} />

                <input value={editData.mobile}
                  onChange={(e)=>setEditData({...editData,mobile:e.target.value})} />

                <br /><br />

                <button onClick={updateStudent}>💾 Save</button>
                <button onClick={() => setEditData(null)}>Cancel</button>
              </div>
            )}
          </div>
        )}

        {/* QUESTION BANK */}
        {active === "questions" && (
          <div>
            <h2>📚 Question Bank</h2>

            <input value={newQ.question}
              placeholder="Question"
              onChange={(e)=>setNewQ({...newQ, question:e.target.value})} />

            <input value={newQ.option1}
              placeholder="Option 1"
              onChange={(e)=>setNewQ({...newQ, option1:e.target.value})} />

            <input value={newQ.option2}
              placeholder="Option 2"
              onChange={(e)=>setNewQ({...newQ, option2:e.target.value})} />

            <input value={newQ.option3}
              placeholder="Option 3"
              onChange={(e)=>setNewQ({...newQ, option3:e.target.value})} />

            <input value={newQ.option4}
              placeholder="Option 4"
              onChange={(e)=>setNewQ({...newQ, option4:e.target.value})} />

            <input value={newQ.answer}
              placeholder="Answer"
              onChange={(e)=>setNewQ({...newQ, answer:e.target.value})} />

              <input
  value={editQ ? editQ.question : newQ.question}
  placeholder="Question"
  onChange={(e) =>
    editQ
      ? setEditQ({ ...editQ, question: e.target.value })
      : setNewQ({ ...newQ, question: e.target.value })
  }
/>

            <br /><br />

          <button onClick={editQ ? updateQuestion : addQuestion}>
  {editQ ? "Update Question" : "Add Question"}
</button>

            <hr />

            {questions.map((q) => (
              <div key={q.id}>
                <b>{q.question}</b>
                <p>{q.option1}</p>
                <p>{q.option2}</p>
                <p>{q.option3}</p>
                <p>{q.option4}</p>
                <p>✅ {q.answer}</p>
                
                <button onClick={() => setEditQ(q)}>✏️ Edit</button>
                <button onClick={() => deleteQuestion(q.id)}>❌ Delete</button>
  
              </div>
            ))}
          </div>
        )}

        {active === "payments" && (
  <div>
    <h2>Student Payments</h2>

    <button
      onClick={() => {
        alert("Clicked ✅");
        payNow();
      }}
      style={{
        padding: "10px",
        background: "green",
        color: "white",
        border: "none",
        cursor: "pointer",
        marginBottom: "20px"
      }}
    >
      💳 Pay Now
    </button>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Course ID</th>
          <th>Course</th>
          <th>Student Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {payments.length > 0 ? (
          payments.map((p, index) => (
            <tr key={index}>
              <td>{p.studentId}</td>
              <td>{p.courseId}</td>
              <td>{p.course}</td>
              <td>{p.studentName}</td>
              <td>{p.email}</td>
              <td>{p.mobile}</td>
              <td>{p.amount}</td>
              <td>
                <span style={{ color: p.status === "PAID" ? "green" : "red" }}>
                  {p.status}
                </span>
              </td>
              <td>{p.date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9">No payments found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

        

        {/* EMAIL */}
        {active === "email" && (
  <div>
    <h2>📧 Send Email to Student</h2>

    <select id="studentSelect">
      <option value="">Select Student</option>
      {students.map((s) => (
        <option key={s.student_id} value={s.email}>
          {s.name} ({s.email})
        </option>
      ))}
    </select>

    <br /><br />

    <textarea
      placeholder="Enter message"
      style={{ width: "600px", height: "200px" }}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    

    <br /><br />

    <button
      onClick={() => {
        const email = document.getElementById("studentSelect").value;

        if (!email) {
          alert("Select student first ❌");
          return;
        }

        sendEmail({ email });
      }}
    >
      Send Email
    </button>
  </div>
  
)}
      </div>
      
    </div>
  )
}