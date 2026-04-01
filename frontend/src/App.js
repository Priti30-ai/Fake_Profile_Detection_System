import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    edge_followed_by: "",
    edge_follow: "",
    username_length: "",
    username_has_number: "",
    full_name_has_number: "",
    full_name_length: "",
    is_private: "",
    is_joined_recently: "",
    has_channel: "",
    is_business_account: "",
    has_guides: "",
    has_external_url: ""
  });

  // ✅ Handle manual input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  // 🔥 Username Prediction (FIXED)
  const handleUsernamePredict = async () => {
    if (!username) {
      alert("Enter username");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/predict-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      // ✅ Handle backend errors
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.prediction);
      }

    } catch (err) {
      console.error("Frontend Error ❌", err);
      setResult("Server not responding");
    }

    setLoading(false);
  };

  // 🔥 Manual Prediction (FIXED)
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // ✅ Handle backend errors
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.prediction);
      }

    } catch (err) {
      console.error("Frontend Error ❌", err);
      setResult("Server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Fake Profile Detection</h1>

      {/* ================= USERNAME MODE ================= */}
      {!showAdvanced && (
        <div className="card">
          <input
            type="text"
            placeholder="Enter Instagram Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button onClick={handleUsernamePredict}>
            {loading ? "Checking..." : "Predict"}
          </button>

          <p className="switch" onClick={() => setShowAdvanced(true)}>
            ⚙️ Advanced Mode
          </p>
        </div>
      )}

      {/* ================= ADVANCED MODE ================= */}
      {showAdvanced && (
        <div className="card">
          <form onSubmit={handleManualSubmit} className="form">

            <input type="number" name="edge_followed_by" placeholder="Followers" onChange={handleChange} required />
            <input type="number" name="edge_follow" placeholder="Following" onChange={handleChange} required />
            <input type="number" name="username_length" placeholder="Username Length" onChange={handleChange} required />

            <select name="username_has_number" onChange={handleChange} required>
              <option value="">Username has number?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="full_name_has_number" onChange={handleChange} required>
              <option value="">Full name has number?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <input type="number" name="full_name_length" placeholder="Full Name Length" onChange={handleChange} required />

            <select name="is_private" onChange={handleChange} required>
              <option value="">Private?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="is_joined_recently" onChange={handleChange} required>
              <option value="">Recently Joined?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="has_channel" onChange={handleChange} required>
              <option value="">Has Channel?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="is_business_account" onChange={handleChange} required>
              <option value="">Business?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="has_guides" onChange={handleChange} required>
              <option value="">Has Guides?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <select name="has_external_url" onChange={handleChange} required>
              <option value="">External URL?</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>

            <button type="submit">
              {loading ? "Checking..." : "Check Profile"}
            </button>
          </form>

          <p className="switch" onClick={() => setShowAdvanced(false)}>
            ⬅ Back to Simple Mode
          </p>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {result && (
        <div className={`result ${result === "Fake Profile" ? "fake" : "real"}`}>
          {result}
        </div>
      )}
    </div>
  );
}

export default App;