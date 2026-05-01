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
app.post("/admission", upload.single("payment"), (req, res) => {
  try {
    console.log("DATA:", req.body);
    console.log("FILE:", req.file);

    const newAdmission = {
      student_id: "STU" + Date.now(),
      course_id: "COURSE" + Date.now(),
      course: req.body.course,
      description: req.body.description,
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      mobile: req.body.mobile,
      address: req.body.address,
      qualification: req.body.qualification,
      batch: req.body.batch,
      paymentFile: req.file ? req.file.filename : null,
    };

   const sql = `
  INSERT INTO admissions 
  (student_id, course_id, course, description, name, dob, gender, email, password, mobile, address, qualification, batch, payment)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
  newAdmission.student_id,
  newAdmission.course_id,
  newAdmission.course,
  newAdmission.description,   // ✅ ADD THIS
  newAdmission.name,
  newAdmission.dob,
  newAdmission.gender,
  newAdmission.email,
  newAdmission.password,
  newAdmission.mobile,
  newAdmission.address,
  newAdmission.qualification,
  newAdmission.batch,
  newAdmission.paymentFile,
];
 

    db.query(sql, values, (err) => {
      if (err) {
        console.log("❌ DB ERROR:", err);
        return res.json({ success: false });
      }

      res.json({
        success: true,
        message: "Admission saved successfully"
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});
 // --------------------
// assignment upload
// --------------------
      



app.post("/assignments", upload.single("file"), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(400).send("No file received ❌");
  }

  const sql = `
    INSERT INTO assignments (student_id, file_name, original_name)
    VALUES (?, ?, ?)
  `;

  db.query(sql,
    [
      req.body.student_id,
      req.file.filename,
      req.file.originalname
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB Error");
      }

      res.send("Upload success ✅");
    }
  );
});

app.get("/assignments", (req, res) => {
  db.query("SELECT * FROM assignments", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
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


    app.post("/api/payment-success", (req, res) => {
  console.log("PAYMENT BODY:", req.body);

  const { paymentId, status, amount, userId } = req.body;

  if (!paymentId) {
    return res.status(400).send("Payment ID missing");
  }

  const sql =
    "INSERT INTO payments (payment_id, status, amount, user_id) VALUES (?, ?, ?, ?)";

  db.query(sql, [paymentId, status, amount, userId], (err) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).send(err);
    }

    console.log("PAYMENT SAVED ✅");
    res.send({ success: true });
  });
});
app.get("/api/payments", (req, res) => {
  db.query("SELECT * FROM payments", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
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


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, userResult) => {
      if (err) return res.json({ success: false });

      if (userResult.length === 0) {
        return res.json({ success: false, message: "EMAIL_NOT_FOUND" });
      }

      const user = userResult[0];

      if (user.password !== password) {
        return res.json({ success: false, message: "WRONG_PASSWORD" });
      }

      // 🔥 NOW GET COURSE SEPARATELY (IMPORTANT FIX)
      db.query(
        "SELECT course FROM admissions WHERE email=? ORDER BY student_id DESC LIMIT 1",
        [email],
        (err2, courseResult) => {

          let course = "";

          if (!err2 && courseResult.length > 0) {
            course = courseResult[0].course;
          }

          return res.json({
            success: true,
            user: {
              name: user.name,
              email: user.email,
              course: course
            }
          });
        }
      );
    }
  );
});
  

   

 
app.get("/my-course/:email", (req, res) => {
  const email = req.params.email;

  const sql = `
    SELECT course, description
    FROM admissions
    WHERE email = ?
    ORDER BY student_id DESC
    LIMIT 1
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.json({ success: false });

    if (result.length === 0) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      course: result[0].course,
      description: result[0].description
    });
  });
});

 
app.get("/student-live-classes/:course_id", (req, res) => {
  const sql = "SELECT * FROM live_classes WHERE course_id=?";
  db.query(sql, [req.params.course_id], (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post("/add-live-class", (req, res) => {
  const { title, link, course, description } = req.body;

  db.query(
    "INSERT INTO live_classes (title, link, course, description) VALUES (?, ?, ?, ?)",
    [title, link, course, description],
    (err, result) => {
      if (err) return res.send(err);
      res.send({ success: true });
    }
  );
});
   
     app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const check = "SELECT * FROM users WHERE email = ?";

  db.query(check, [email], (err, result) => {
    if (err) return res.json({ success: false, message: "DB_ERROR" });

    if (result.length > 0) {
      return res.json({
        success: false,
        message: "EMAIL_ALREADY_EXISTS"
      });
    }

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err2) => {
      if (err2) {
        console.log("INSERT ERROR:", err2);
        return res.json({ success: false, message: "INSERT_FAILED" });
      }

      res.json({ success: true, message: "REGISTERED" });
    });
  });
});


app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const sql = "SELECT * FROM reset_tokens WHERE token=? AND expiry > NOW()";

  db.query(sql, [token], (err, result) => {
    if (result.length === 0) {
      return res.json({ success: false, message: "Invalid/Expired token" });
    }

    const email = result[0].email;

    const update = "UPDATE users SET password=? WHERE email=?";

    db.query(update, [password, email], () => {
      res.json({ success: true, message: "Password updated ✅" });
    });
  });
});

   app.get("/courses", (req, res) => {
  const sql = "SELECT * FROM courses";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
