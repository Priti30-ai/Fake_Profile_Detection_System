const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const db = require("./db"); // ✅ MySQL connection

const app = express();
app.use(cors());
app.use(express.json());

// API route
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

        // ✅ Convert prediction
        const predictionResult = result.trim() === "1"
            ? "Fake Profile"
            : "Real Profile";

        // ✅ Insert into MySQL
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

                return res.json({
                    error: "Database error"
                });
            }

            console.log("Data stored in MySQL ✅");

            // ✅ SEND RESPONSE ONLY AFTER DB SUCCESS
            res.json({
                prediction: predictionResult
            });
        });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});