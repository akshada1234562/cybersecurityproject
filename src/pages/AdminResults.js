import React, { useEffect, useState } from "react";

export default function AdminResults() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/results")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Test Results</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Total</th>
            <th>Attempted</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.score}</td>
              <td>{item.total_questions}</td>
              <td>{item.attempted}</td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}