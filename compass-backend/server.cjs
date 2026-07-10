// Various parts of this code, past or present,
// came from an AI model: Claude Haiku 4.5.

const PORT = 5000;

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

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

    // Generate a personalized roadmap based on user input
    const roadmap = generatePersonalizedRoadmap({
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
function generatePersonalizedRoadmap(userInput) {
  // Create a list of learning waypoints based on interests and experience level
  const waypoints = createWaypoints(userInput);

  // Calculate the current progress (for new users, it's 0%)
  const progressPercent = 0;

  // Determine the next step based on experience level
  const nextStep = determineNextStep(userInput);

  // Create and return the response object
  return {
    destination: userInput.careerGoal,        // The user's career goal
    currentStage: userInput.experienceLevel,  // Their current experience level
    progressPercent: progressPercent,         // How far along they are (0% for new users)
    nextStep: nextStep,                       // What they should do first
    waypoints: waypoints                      // The learning milestones to hit
  };
}

// ============================================
// HELPER FUNCTION: createWaypoints
// ============================================
/*
  Creates a list of learning waypoints (milestones) based on the user's
  learning interests and experience level.
*/
function createWaypoints(userInput) {
  // Define a library of possible learning waypoints
  const allWaypoints = {
    fundamentals: {
      title: 'Master Programming Fundamentals',
      description: 'Learn variables, data types, functions, loops, and conditionals',
      category: 'fundamentals',
      status: 'pending'
    },
    oop: {
      title: 'Object-Oriented Programming (OOP)',
      description: 'Understand classes, inheritance, encapsulation, and polymorphism',
      category: 'fundamentals',
      status: 'pending'
    },
    react: {
      title: 'Learn React Framework',
      description: 'Master components, state, props, and hooks for building UIs',
      category: 'practice',
      status: 'pending'
    },
    nodejs: {
      title: 'Build Backend with Node.js',
      description: 'Learn Express, middleware, routing, and server-side JavaScript',
      category: 'practice',
      status: 'pending'
    },
    database: {
      title: 'Database Design & SQL',
      description: 'Understand database design, SQL queries, and data relationships',
      category: 'practice',
      status: 'pending'
    },
    project: {
      title: 'Build a Full Portfolio Project',
      description: 'Create a complete project combining frontend, backend, and database',
      category: 'project',
      status: 'pending'
    },
    testing: {
      title: 'Testing & Debugging',
      description: 'Learn unit testing, integration testing, and debugging techniques',
      category: 'practice',
      status: 'pending'
    }
  };

  // Start with fundamentals for beginners
  let selectedWaypoints = [allWaypoints.fundamentals];

  // Add waypoints based on learning interests
  if (userInput.learningInterests && userInput.learningInterests.length > 0) {
    if (userInput.learningInterests.includes('React')) {
      selectedWaypoints.push(allWaypoints.react);
    }
    if (userInput.learningInterests.includes('Node.js')) {
      selectedWaypoints.push(allWaypoints.nodejs);
    }
    if (userInput.learningInterests.includes('databases')) {
      selectedWaypoints.push(allWaypoints.database);
    }
  }

  // Add testing if intermediate or advanced
  if (userInput.experienceLevel !== 'beginner') {
    selectedWaypoints.push(allWaypoints.testing);
  }

  // Always add a capstone project at the end
  selectedWaypoints.push(allWaypoints.project);

  return selectedWaypoints;
}

// ============================================
// HELPER FUNCTION: determineNextStep
// ============================================
/*
  Suggests the next step based on the user's experience level and goals.
*/
function determineNextStep(userInput) {
  // For beginners, focus on fundamentals
  if (userInput.experienceLevel === 'beginner') {
    return 'Start with JavaScript fundamentals: variables, data types, and functions';
  }

  // For intermediate users, focus on frameworks or advanced concepts
  if (userInput.experienceLevel === 'intermediate') {
    if (userInput.learningInterests && userInput.learningInterests.includes('React')) {
      return 'Learn React components, state management, and hooks';
    }
    return 'Choose a framework (React, Vue, or Angular) to specialize in';
  }

  // For advanced users, focus on system design and optimization
  if (userInput.experienceLevel === 'advanced') {
    return 'Focus on system design, performance optimization, and best practices';
  }

  // Default next step
  return 'Review your learning interests and start with the first waypoint';
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
  Once running, you can access it at http://localhost:5000
  (check the port number, which may have changed)
*/
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`POST /journey/generate - Generate a learning roadmap`);
  console.log(`GET /roadmap/1234 - Retrieve roadmap 1234`);
});
