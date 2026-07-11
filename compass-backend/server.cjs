// Various parts of this code, past or present,
// came from an AI model: Claude Haiku 4.5.

const PORT = 8000;

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// ----------------------------------------------------------------------------
// Prepare to call an AI model.
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY environment variable is not set');
}
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({apiKey});
// ============================================
// REQUEST SCHEMA DEFINITION
// ============================================
/*
  This schema represents what the client sends to the server.
  It contains information about the user's learning journey.
*/
const RequestSchema = {
  userType: String,              // e.g., "student", "professional", "career-changer"
  careerGoal: String,            // e.g., "become a full-stack developer"
  experienceLevel: String,       // e.g., "beginner", "intermediate", "advanced"
  weeklyTimeCommitment: String,  // e.g., "5 hours", "10 hours", "20 hours"
  existingSkills: [String],      // e.g., ["HTML", "CSS", "basic JavaScript"]
  learningInterests: [String],   // e.g., ["React", "Node.js", "databases"]
  targetTimeline: String,        // e.g., "3 months", "6 months", "1 year"
  biggestChallenge: String,      // e.g., "time management", "understanding concepts"
  additionalNotes: String        // e.g., any extra information from the user
};

// ============================================
// RESPONSE SCHEMA DEFINITION
// ============================================
/*
  This schema represents what the server sends back to the client.
  It contains a personalized learning roadmap for the user.
*/
const ResponseSchema = {
  destination: String,           // e.g., "Full-Stack JavaScript Developer"
  currentStage: String,          // e.g., "Foundation Building"
  progressPercent: Number,       // e.g., 15 (represents 15%)
  nextStep: String,              // e.g., "Complete JavaScript fundamentals course"
  waypoints: [
    {
      title: String,             // e.g., "Learn JavaScript Basics"
      description: String,       // e.g., "Master variables, functions, and control flow"
      category: String,          // e.g., "fundamentals", "practice", "project"
      status: String             // e.g., "pending", "in-progress", "completed"
    }
  ]
};

// ============================================
// EXAMPLE DATA - In-memory storage (for demo purposes)
// ============================================
/*
  In a real application, you would use a database like MongoDB or PostgreSQL.
  For this simple example, we're storing data in memory.
*/
const userRoadmaps = {};

let roadmapGlobalId = 1;

// ============================================
// ROUTE: POST /generate-roadmap
// ============================================
/*
  This route accepts a request with the RequestSchema format
  and returns a personalized learning roadmap in ResponseSchema format.

  How it works:
  1. Receives user input from the client
  2. Validates the input (basic check)
  3. Generates a personalized roadmap based on the input
  4. Sends back the roadmap in ResponseSchema format
*/
app.post("/journey/generate", (req, res) => {
  try {
    // Extract the request data from the request body
    const {
      userType,
      careerGoal,
      experienceLevel,
      weeklyTimeCommitment,
      existingSkills,
      learningInterests,
      targetTimeline,
      biggestChallenge,
      additionalNotes
    } = req.body;

    // Basic validation - check if required fields are present
    if (!userType || !careerGoal || !experienceLevel) {
      return res.status(400).json({
        error: 'Missing required fields: userType, careerGoal, experienceLevel'
      });
    }

    // Generate a unique ID for this roadmap (in a real app, use a database)
    const roadmapId = `roadmap_${roadmapGlobalId}`;

    async function runAndWaitForCodeRelatedToAI() {

      // Generate a personalized roadmap based on user input
      const roadmap = await generatePersonalizedRoadmap({
        userType,
        careerGoal,
        experienceLevel,
        weeklyTimeCommitment,
        existingSkills,
        learningInterests,
        targetTimeline,
        biggestChallenge,
        additionalNotes
      });

      // Store the roadmap in memory (in a real app, save to database)
      userRoadmaps[roadmapGlobalId] = roadmap;
      roadmapGlobalId += 1;

      // Send the response back to the client
      res.status(200).json({
        id: roadmapId,
        ...roadmap
      });
    }

    runAndWaitForCodeRelatedToAI();

  } catch (error) {
    // Handle any errors that occur
    console.error('Error generating roadmap:', error);
    res.status(500).json({
      error: 'Failed to generate roadmap. Please try again.'
    });
  }
});

// ============================================
// ROUTE: GET /roadmap/:id
// ============================================
/*
  This route retrieves a previously generated roadmap by its ID.
*/
app.get('/roadmap/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Look up the roadmap in memory
    const roadmap = userRoadmaps[id];

    // If roadmap not found, return a 404 error
    if (!roadmap) {
      return res.status(404).json({
        error: 'Roadmap not found'
      });
    }

    // Send the roadmap back to the client
    res.status(200).json({
      id,
      ...roadmap
    });

  } catch (error) {
    console.error('Error retrieving roadmap:', error);
    res.status(500).json({
      error: 'Failed to retrieve roadmap'
    });
  }
});

// ============================================
// HELPER FUNCTION: generatePersonalizedRoadmap
// ============================================
/*
  This function takes the user's input and creates a personalized learning roadmap.
  It's a simplified version - in a real app, you'd use more complex logic or AI.
*/
async function generatePersonalizedRoadmap(userInput) {

    const u = userInput;

    // Create a prompt for an AI model.
    const prompt = `

        A user has specific job skills and wants to learn other jobs skills.

        The following JSON dictionary has information about the user:

        {
          userType: "${u.userType}",
          careerGoal: "${u.careerGoal}",
          experienceLevel: "${u.experienceLevel}",
          weeklyTimeCommitment: "${u.weeklyTimeCommitment}",
          existingSkills: "${u.existingSkills}",
          learningInterests: "${u.learningInterests}",
          targetTimeline: "${u.targetTimeline}",
          biggestChallenge: "${u.biggestChallenge}",
          additionalNotes: "${u.additionalNotes}"
        }

        Give advice to the user.

        Your response should be only the following JSON dictionary,
        but replace the values of the dictionary by appropriate advice.
        {
            destination: "What is a possible career for the user?",
            currentStage: "How much job experience might the user have?",
            progressPercent: "How close is the user to getting a new job?",
            nextStep: "What should the user do next?",
            waypoints: "What learning milestones should the user do?"
        }
    `
    // Call an AI model.
    const interaction = await ai.interactions.create
    (
        {
            model: "gemini-3.5-flash",
            input: prompt,
        }
    );
    // Translate the text into a dictionary.
    const roadmap = await JSON.parse(interaction.output_text);

    return roadmap;
}

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
/*
  This middleware handles any requests to routes that don't exist.
*/
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// ============================================
// START THE SERVER
// ============================================
/*
  This starts the server on the specified PORT.
*/
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`POST /journey/generate - Generate a learning roadmap`);
  console.log(`GET /roadmap/1234 - Retrieve roadmap 1234`);
});
