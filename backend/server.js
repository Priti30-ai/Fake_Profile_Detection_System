const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");

// ⚠️ FIX THIS PATH IF NEEDED
// const db = require("../database/db");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Python paths
const pythonPath = "C:\\Users\\Priti\\AppData\\Local\\Programs\\Python\\Python312\\python.exe";
const scriptPath = path.join(__dirname, "../ai-model/predict.py");

// ==============================================
// 🔥 COMMON FUNCTION
// ==============================================
const runPython = (inputData, callback) => {
    console.log("➡️ Sending to Python:", inputData); // ✅ DEBUG

    const pythonProcess = spawn(pythonPath, [
        scriptPath,
        JSON.stringify(inputData)
    ]);

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
        console.log("🐍 Python Output:", result); // ✅ DEBUG
        console.log("🐍 Python Error:", errorOutput); // ✅ DEBUG

        if (code !== 0) {
            return callback({
                error: "Python error",
                details: errorOutput
            });
        }

        const cleaned = result.trim();

        if (cleaned !== "0" && cleaned !== "1") {
            return callback({
                error: "Invalid model output",
                raw: cleaned
            });
        }

        const predictionResult =
            cleaned === "1" ? "Fake Profile" : "Real Profile";

        callback(null, predictionResult);
    });
};

// ==============================================
// 🔥 EXISTING ROUTE (ADVANCED MODE)
// ==============================================
app.post("/predict", (req, res) => {
    const inputData = req.body;

    runPython(inputData, (err, predictionResult) => {
        if (err) {
            console.error("Predict Error ❌", err);
            return res.json(err);
        }

        const query = `
            INSERT INTO predictions (
                edge_followed_by, edge_follow, username_length, username_has_number,
                full_name_has_number, full_name_length, is_private,
                is_joined_recently, has_channel, is_business_account,
                has_guides, has_external_url, prediction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            inputData.edge_followed_by,
            inputData.edge_follow,
            inputData.username_length,
            inputData.username_has_number,
            inputData.full_name_has_number,
            inputData.full_name_length,
            inputData.is_private,
            inputData.is_joined_recently,
            inputData.has_channel,
            inputData.is_business_account,
            inputData.has_guides,
            inputData.has_external_url,
            predictionResult
        ];

        db.query(query, values, (err, dbResult) => {
            if (err) {
                console.error("DB Insert Error ❌", err);
                return res.json({ error: "Database error" });
            }
            console.log("Data stored in MySQL ✅");

            res.json({
                prediction: predictionResult
            });
        });
    });
});

// ==============================================
// 🔥 USERNAME MODE (FIXED)
// ==============================================
app.post("/predict-username", (req, res) => {
    try {
        console.log("📩 Username request:", req.body); // ✅ DEBUG
        const { username } = req.body;

        if (!username) {
            return res.json({ error: "Username is required" });
        }

        const inputData = {
            edge_followed_by: 0,
            edge_follow: 0,
            username_length: Number(username.length),
            username_has_number: /\d/.test(username) ? 1 : 0,
            full_name_has_number: 0,
            full_name_length: 0,
            is_private: 0,
            is_joined_recently: 0,
            has_channel: 0,
            is_business_account: 0,
            has_guides: 0,
            has_external_url: 0
        };

        runPython(inputData, (err, predictionResult) => {
            if (err) {
                console.error("Username Route Error ❌", err);
                return res.json(err);
            }

            res.json({
                prediction: predictionResult
            });
        });

    } catch (error) {
        console.error("Username Route Crash ❌", error);
        res.json({ error: "Server crash" });
    }
});

// ==============================================
// 🚀 START SERVER
// ==============================================
app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});
