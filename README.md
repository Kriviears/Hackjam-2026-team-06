# 🚀 Hack Jam 2026 - Team 06: Compass Crew

# 🚀 Feature Overview

## 🧭 AI-Powered Career Roadmaps
Generates personalized career roadmaps based on each learner’s background, goals, experience, timeline, and weekly availability.

## 📍 Interactive Journey Visualization
Displays the learner’s career path as an immersive roadmap with clear milestones, current priorities, and upcoming steps.

## 📚 Personalized Resource Recommendations
Returns relevant books, videos, worksheets, courses, and other learning resources alongside the generated roadmap to support the learner’s specific goals.

## 📈 Timeline and Pace Feedback
Evaluates the learner’s target timeline and weekly learning commitment, then provides personalized feedback on whether the plan appears realistic and sustainable.

## 📊 Personalized Dashboard
Provides a centralized view of the learner’s journey, current milestone, progress, recommendations, and next actions.

## 🤖 Ask Compass AI Assistant
Allows learners to ask questions about their roadmap and receive contextual guidance based on their current journey data.

## 🎨 Modern User Experience
Uses a responsive, futuristic interface designed to make career planning engaging, visual, and easy to navigate.

## 🏗️ Scalable Architecture
Built with a modular React and Node.js architecture that can support future features such as employer matching, mentor connections, saved profiles, and dynamic roadmap updates.


## 🚀 Getting Started

# Installation and Setup
## Prerequisites

- Install Node.js (version 18 or later recommended).
- Clone or download the Compass repository.

## Install Dependencies

Open a terminal and navigate to the project directory.

### Backend

```bash
cd compass-backend
npm install
```

### Frontend

```bash
cd ../compass-frontend
npm install
```

## Run the Application

Open **two terminal windows**.

### Terminal 1 – Start the Backend

```bash
cd compass-backend
node server.cjs
```

> If the project uses nodemon, you can alternatively run:
>
> ```bash
> npm run dev
> ```

### Terminal 2 – Start the Frontend

```bash
cd compass-frontend
npm run dev
```

## Launch the Application

Open your browser and navigate to:

```
http://localhost:5173
```
## Environment Variables

A Google AI API key is required to enable AI-powered roadmap generation.

Create a `.env` file using the provided `.env.example` template and add your API key before starting the application.

# Acknowledgments

The Compass team would like to acknowledge the following tools and services that supported the development of this project:

- OpenAI ChatGPT for design consultation, architecture discussions, documentation, and development guidance.
- OpenAI Codex for implementation assistance and code generation.
- Google AI Studio (Gemini API) for AI-powered roadmap generation.
- Lucide React for open-source icons.

- # Open-Source Licenses
- React — MIT License
- Express.js — MIT License
- Node.js — MIT License
- Vite — MIT License
- Lucide React — ISC License

- Special thanks to our HackJam mentor, Josh Geter, for providing guidance, thoughtful feedback, and encouragement during development of Compass.
