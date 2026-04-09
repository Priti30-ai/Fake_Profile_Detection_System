import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // ✅ use same styling

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/admin");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error ❌", error);
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;