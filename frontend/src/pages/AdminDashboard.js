import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then(res => res.json())
      .then(data => setHistory(data)) // ✅ FIXED (IMPORTANT)
      .catch(err => console.error("Fetch error ❌", err));
  }, []);

  // 🔹 helper to convert 0/1 → Yes/No
  const formatBool = (val) => (val === 1 ? "Yes" : "No");

  return (
    <div className="dashboard-container">
      <h2>Search History</h2>

      {history.length === 0 ? (
        <p>No data found</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="card">

            {/* 🔥 Prediction */}
            <h3 className={item.prediction === "Fake Profile" ? "fake" : "real"}>
              {item.prediction}
            </h3>

            {/* 🔥 REQUIRED FIELDS ONLY */}
            <div className="grid">
              <p><strong>Followers:</strong> {item.edge_followed_by}</p>
              <p><strong>Following:</strong> {item.edge_follow}</p>
              <p><strong>Username Length:</strong> {item.username_length}</p>
              <p><strong>Has Number:</strong> {formatBool(item.username_has_number)}</p>
              <p><strong>Private:</strong> {formatBool(item.is_private)}</p>
              <p><strong>Business Account:</strong> {formatBool(item.is_business_account)}</p>
              <p><strong>External URL:</strong> {formatBool(item.has_external_url)}</p>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;