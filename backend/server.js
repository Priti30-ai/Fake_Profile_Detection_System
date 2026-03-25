const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// API route
app.post("/predict", (req, res) => {
    const inputData = req.body;

    // ✅ Use correct Python path (Python 3.12)
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

        res.json({
            prediction: result.trim() === "1" ? "Fake Profile" : "Real Profile"
        });
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});