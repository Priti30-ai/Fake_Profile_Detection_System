const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


// ================= EXISTING API (NO CHANGE) =================
app.post("/predict", (req, res) => {
    const inputData = req.body;

    const pythonProcess = spawn(
        "C:\\Users\\Priti\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
        ["../ai-model/predict.py", JSON.stringify(inputData)]
    );

    let result = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {

        if (code !== 0) {
            return res.json({
                error: "Python error",
                details: errorOutput
            });
        }

        const predictionResult = result.trim() === "1"
            ? "Fake Profile"
            : "Real Profile";

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

        db.query(query, values, (err) => {
            if (err) {
                console.error("DB Insert Error ❌", err);
                return res.json({ error: "Database error" });
            }

            console.log("Manual input stored in MySQL ✅");

            res.json({
                prediction: predictionResult
            });
        });
    });
});


// ================= SMART USERNAME API =================
app.post("/predict-username", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.json({ error: "Username required" });
    }

    // 🔥 SMART FEATURE GENERATION
    const hasNumber = /\d/.test(username) ? 1 : 0;
    const underscoreCount = (username.match(/_/g) || []).length;
    const length = username.length;

    // 🎯 Followers logic (balanced)
    let followers;
    if (hasNumber && underscoreCount > 2) {
        followers = Math.floor(Math.random() * 200 + 50);
    } else {
        followers = Math.floor(Math.random() * 5000 + 500);
    }

    // 🎯 Following logic
    let following;
    if (hasNumber) {
        following = Math.floor(Math.random() * 2000 + 500);
    } else {
        following = Math.floor(Math.random() * 500 + 100);
    }

    const generatedData = {
        edge_followed_by: followers,
        edge_follow: following,
        username_length: length,
        username_has_number: hasNumber,
        full_name_has_number: hasNumber,
        full_name_length: length + 2,
        is_private: hasNumber ? 0 : 1,
        is_joined_recently: hasNumber ? 1 : 0,
        has_channel: hasNumber ? 0 : 1,

        // ✅ Balanced randomness (no bias)
        is_business_account: Math.random() > 0.5 ? 1 : 0,
        has_guides: hasNumber ? 0 : 1,
        has_external_url: Math.random() > 0.5 ? 1 : 0
    };

    const pythonProcess = spawn(
        "C:\\Users\\Priti\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
        ["../ai-model/predict.py", JSON.stringify(generatedData)]
    );

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.on("close", () => {

        const predictionResult = result.trim() === "1"
            ? "Fake Profile"
            : "Real Profile";

        const query = `
            INSERT INTO predictions (
                edge_followed_by, edge_follow, username_length, username_has_number,
                full_name_has_number, full_name_length, is_private,
                is_joined_recently, has_channel, is_business_account,
                has_guides, has_external_url, prediction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            generatedData.edge_followed_by,
            generatedData.edge_follow,
            generatedData.username_length,
            generatedData.username_has_number,
            generatedData.full_name_has_number,
            generatedData.full_name_length,
            generatedData.is_private,
            generatedData.is_joined_recently,
            generatedData.has_channel,
            generatedData.is_business_account,
            generatedData.has_guides,
            generatedData.has_external_url,
            predictionResult
        ];

        db.query(query, values, (err) => {
            if (err) {
                console.error("DB Insert Error ❌", err);
                return res.json({ error: "Database error" });
            }

            console.log("Username-based data stored in MySQL ✅");

            res.json({
                prediction: predictionResult
            });
        });
    });
});


// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});