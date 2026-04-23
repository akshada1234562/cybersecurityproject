import React, { useState, useEffect } from "react";

const questions = [
  {
    question: "Java मध्ये JVM म्हणजे काय?",
    options: ["Java Virtual Machine", "Java Variable Method", "Joint Virtual Machine", "None"],
    answer: "Java Virtual Machine"
  },
  {
    question: "HTML full form?",
    options: ["Hyper Text Markup Language", "HighText Machine Language", "Hyper Tool ML", "None"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "CSS चा वापर कशासाठी होतो?",
    options: ["Styling", "Programming", "Database", "Server"],
    answer: "Styling"
  },
  {
    question: "React कोणत्या company ने बनवला?",
    options: ["Google", "Facebook", "Microsoft", "Amazon"],
    answer: "Facebook"
  },
  {
    question: "JS मध्ये === म्हणजे?",
    options: ["Only value check", "Value + type check", "Assignment", "None"],
    answer: "Value + type check"
  },
  {
    question: "Node.js कशासाठी वापरतो?",
    options: ["Frontend", "Backend", "Design", "Testing"],
    answer: "Backend"
  },
  {
    question: "SQL म्हणजे काय?",
    options: ["Query Language", "Programming Language", "Markup", "None"],
    answer: "Query Language"
  },
  {
    question: "useState काय आहे?",
    options: ["Hook", "Function", "Class", "API"],
    answer: "Hook"
  },
  {
    question: "API full form?",
    options: ["Application Programming Interface", "App Program Input", "None", "All"],
    answer: "Application Programming Interface"
  },
  {
    question: "MongoDB म्हणजे?",
    options: ["SQL DB", "NoSQL DB", "Language", "Tool"],
    answer: "NoSQL DB"
  }
];

export default function TestModule() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(600); // 10 min
  const [submitted, setSubmitted] = useState(false);

  // ⏱ TIMER
  useEffect(() => {
    if (time > 0 && !submitted) {
      const timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (time === 0) {
      handleSubmit(); // auto submit
    }
  }, [time, submitted]);

  // ✅ Select Answer
  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  // ➡ Next
  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  // ⬅ Previous
  const prev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  // 🧮 SCORE
  const calculateScore = () => {
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score += 1;
      } else if (answers[index]) {
        score -= 0.25;
      }
    });

    return score;
  };

  // 🚀 SUBMIT
 const handleSubmit = async () => {
  const score = calculateScore();

  try {
    await fetch("http://localhost:5000/save-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Akshada",
        email: "test@gmail.com",
        score: score,
        total: questions.length,
        attempted: Object.keys(answers).length
      })
    });

    setSubmitted(true);
  } catch (error) {
    console.log("Error:", error);
  }
};

  // ⏳ FORMAT TIME
  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // 🎯 RESULT SCREEN
  if (submitted) {
    return (
      <div style={styles.container}>
        <h2>Test Result</h2>
        <h3>Score: {calculateScore().toFixed(2)}</h3>
        <p>Total Questions: {questions.length}</p>
        <p>Attempted: {Object.keys(answers).length}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      
      {/* TIMER */}
      <div style={styles.timer}>⏱ {formatTime()}</div>

      {/* QUESTION */}
      <h3>
        Q{currentQ + 1}. {questions[currentQ].question}
      </h3>

      {/* OPTIONS */}
      {questions[currentQ].options.map((opt, i) => (
        <div key={i} style={styles.option}>
          <input
            type="radio"
            name="option"
            checked={answers[currentQ] === opt}
            onChange={() => handleAnswer(opt)}
          />
          {opt}
        </div>
      ))}

      {/* NAV BUTTONS */}
      <div style={styles.buttons}>
        <button onClick={prev} disabled={currentQ === 0}>
          Previous
        </button>

        <button onClick={next} disabled={currentQ === questions.length - 1}>
          Next
        </button>
      </div>

      {/* SUBMIT */}
      <button style={styles.submit} onClick={handleSubmit}>
        Submit Test
      </button>

      {/* QUESTION NAV */}
      <div style={styles.palette}>
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            style={{
              ...styles.qBtn,
              background: answers[i] ? "#4caf50" : "#ccc"
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  timer: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "red",
    marginBottom: "10px"
  },
  option: {
    margin: "8px 0"
  },
  buttons: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between"
  },
  submit: {
    marginTop: "20px",
    padding: "10px",
    background: "orange",
    border: "none",
    cursor: "pointer"
  },
  palette: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "5px"
  },
  qBtn: {
    width: "35px",
    height: "35px",
    border: "none",
    cursor: "pointer"
  }
};