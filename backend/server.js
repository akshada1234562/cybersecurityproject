console.log("🔥 THIS SERVER FILE IS RUNNING");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// MYSQL CONNECTION
// --------------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cybersecurityproject",
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Error:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// --------------------
// FILE SETUP
// --------------------
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("data.json")) {
  fs.writeFileSync("data.json", "[]");
}

// --------------------
// MULTER
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// --------------------
// HOME ROUTE
// --------------------
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// --------------------
// GET ALL (MYSQL)
// --------------------
app.get("/students", (req, res) => {
  db.query("SELECT * FROM admissions", (err, result) => {
    if (err) {
      console.log("❌ MYSQL FETCH ERROR:", err);
      return res.json([]);
    }
    res.json(result);
  });
});

// --------------------
// CREATE ADMISSION (UPDATED)
// --------------------
app.post("/admission", (req, res) => {

  // 🔥 multer manually call (optional file)
  upload.single("payment")(req, res, (err) => {

    if (err) {
      console.log("❌ MULTER ERROR:", err);
      return res.status(500).json({ success: false });
    }

    console.log("DATA:", req.body);
    console.log("FILE:", req.file);

    try {
      const newAdmission = {
        student_id: "STU" + Date.now(),
        course_id: "COURSE" + Date.now(),
        course: req.body.course,
        name: req.body.name,
        dob: req.body.dob,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        qualification: req.body.qualification,
        batch: req.body.batch,
        paymentFile: req.file ? req.file.filename : null,
      };

      // --------------------
      // MYSQL SAVE
      // --------------------
      const sql = `
        INSERT INTO admissions 
        (student_id, course_id, course, name, dob, gender, email, mobile, address, qualification, batch, payment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        newAdmission.student_id,
        newAdmission.course_id,
        newAdmission.course,
        newAdmission.name,
        newAdmission.dob,
        newAdmission.gender,
        newAdmission.email,
        newAdmission.mobile,
        newAdmission.address,
        newAdmission.qualification,
        newAdmission.batch,
        newAdmission.paymentFile,
      ];

      db.query(sql, values, (err) => {
        if (err) {
          console.log("❌ MYSQL INSERT ERROR:", err);
          return res.json({ success: false });
        }

        console.log("✅ Saved to MySQL");

        res.json({
          success: true,
          message: "Admission saved successfully",
          data: newAdmission,
        });
      });

    } catch (err) {
      console.log("❌ ERROR:", err.message);
      res.status(500).json({ success: false });
    }

  });
});

// --------------------
// SEARCH
// --------------------
app.get("/search/:id", (req, res) => {
  db.query(
    "SELECT * FROM admissions WHERE student_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json(result);
      }
    }
  );
});

// --------------------
// UPDATE
// --------------------
app.put("/update/:id", (req, res) => {
  const sql = `
    UPDATE admissions
    SET name=?, mobile=?, email=?, course=?
    WHERE student_id=?
  `;

  const values = [
    req.body.name,
    req.body.mobile,
    req.body.email,
    req.body.course,
    req.params.id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// --------------------
// DELETE
// --------------------
app.delete("/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM admissions WHERE student_id=?",
    [req.params.id],
    (err) => {
      if (err) {
        res.json({ success: false });
      } else {
        res.json({ success: true });
      }
    }
  );
});
app.use("/uploads", express.static("uploads"));

// 📥 SAVE RESULT API
app.post("/save-result", (req, res) => {
  const { name, email, score, total, attempted } = req.body;

  const sql = `
    INSERT INTO results (name, email, score, total_questions, attempted)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, score, total, attempted], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error saving result");
    }
    res.send("Result Saved ✅");
  });
});


// 📊 GET ALL RESULTS (ADMIN)
app.get("/results", (req, res) => {
  db.query("SELECT * FROM results ORDER BY id DESC", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
});

app.post("/add-question", (req, res) => {
  const { question, option1, option2, option3, option4, answer } = req.body;

  const sql = "INSERT INTO questions (question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [question, option1, option2, option3, option4, answer], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ msg: "Error adding question" });
    }
    res.json({ msg: "Question added successfully" });
  });
});

app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
});

app.put("/update-question/:id", (req, res) => {
  const { id } = req.params;
  const { question, option1, option2, option3, option4, answer } = req.body;

  const sql = `
    UPDATE questions 
    SET question=?, option1=?, option2=?, option3=?, option4=?, answer=?
    WHERE id=?
  `;

  db.query(sql, [question, option1, option2, option3, option4, answer, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Updated");
  });
});

app.delete("/delete-question/:id", (req, res) => {
  db.query("DELETE FROM questions WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Deleted");
  });
});

// ADD QUESTION
app.post("/add-question", (req, res) => {
  const { question, option1, option2, option3, option4, answer } = req.body;

  const sql = "INSERT INTO questions (question, option1, option2, option3, option4, answer) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [question, option1, option2, option3, option4, answer], (err) => {
    if (err) return res.json({ error: err });
    res.json({ msg: "Question Added" });
  });
});

// GET QUESTIONS
app.get("/questions", (req, res) => {
  db.query("SELECT * FROM questions", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// DELETE QUESTION
app.delete("/delete-question/:id", (req, res) => {
  db.query("DELETE FROM questions WHERE id=?", [req.params.id], (err) => {
    if (err) return res.json(err);
    res.json({ msg: "Deleted" });
  });
});

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_SgT5EWmTYjVQEU",
  key_secret: "kxyx5h0t3R2zMmVEul6D5P0N"
});

// ✅ THIS IS IMPORTANT
app.post("/create-order", async (req, res) => {
  console.log("API HIT ✅");

  try {
    const order = await razorpay.orders.create({
      amount: 50000,
      currency: "INR"
    });

    console.log("ORDER CREATED ✅:", order);

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating order");
  }
});

app.post("/create-payment", (req, res) => {
  const { student_id, course_id, amount } = req.body;

  const sql = `
    INSERT INTO payment (student_id, course_id, amount, status, date)
    VALUES (?, ?, ?, 'Pending', NOW())
  `;

  db.query(sql, [student_id, course_id, amount], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.send({ message: "Payment saved" });
  });
});

app.post("/save-payment", (req, res) => {
  const {
    studentId,
    courseId,
    course,
    studentName,
    email,
    mobile,
    amount,
    payment_id,
    order_id,
    status
  } = req.body;

  const sql = `
    INSERT INTO payments 
    (studentId, courseId, course, studentName, email, mobile, amount, payment_id, order_id, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      studentId,
      courseId,
      course,
      studentName,
      email,
      mobile,
      amount,
      payment_id,
      order_id,
      status
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error ❌");
      }

      res.send("Payment Saved ✅");
    }
  );
});


app.get("/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("DB Error");
    }
    res.json(result);
  });
});


// ✅ Email transporter setup (Gmail use कर)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sakshada37@gmail.com",
    pass: "eknl buvr ypxe qiot"
  }
});

app.post("/send-email", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    const mailOptions = {
      from: "YOUR_EMAIL@gmail.com",
      to: email,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Email failed" });
  }
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});