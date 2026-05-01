import React, { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const token = window.location.pathname.split("/").pop();

    const res = await fetch(
      `http://localhost:5000/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔐 Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}