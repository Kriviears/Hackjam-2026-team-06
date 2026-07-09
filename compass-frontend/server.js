const PORT = 5000;

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/journey/generate", (req, res) => {

    const { userType, careerGoal, experienceLevel, weeklyTimeCommitment } = req.body;

    res.json({

        destination: "Data Analyst",
        currentStage: "Current Learner",
        progressPercent: 25,
        nextStep: "Complete SQL practice and begin a portfolio project",

        waypoints: [
            {
                title: "Get Your Bearings",
                description: "Identify your current skills, goals, and available time.",
                category: "Orientation",
                status: "complete"
            },
            {
                title: "Build Core Skills",
                description: "Focus on SQL, Excel, Python basics, and data storytelling.",
                category: "Technical Skill",
                status: "current"
            },
            {
                title: "Create Portfolio Proof",
                description: "Build a small data project that shows your ability to analyze and explain data.",
                category: "Portfolio",
                status: "upcoming"
            },
            {
                title: "Prepare for Interviews",
                description: "Practice behavioral and technical interview questions.",
                category: "Career Readiness",
                status: "upcoming"
            },
            {
                title: "You’re Hired",
                description: "Apply, interview, and land your first or next tech role.",
                category: "Destination",
                status: "upcoming"
            },
        ],
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
