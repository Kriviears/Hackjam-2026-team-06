// Various parts of this code, past or present,
// came from an AI model: Claude Haiku 4.5.
// Dotenv is used to load environment variables from a .env file into process.env.
require('dotenv').config();

const PORT = 8000;

const { readFile } = require("fs/promises");
const path = require("path");
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
const ai = new GoogleGenAI({ apiKey });
const ROADMAP_PROMPT_PATH = path.resolve(
  __dirname,
  "prompts",
  "compass-roadmap-prompt.md"
);
let roadmapPromptTemplate = "";
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
  nextStep: String,              // e.g., "Complete JavaScript fundamentals course"
  waypoints: [
    {
      title: String,             // e.g., "Learn JavaScript Basics"
      description: String,       // e.g., "Master variables, functions, and control flow"
      category: String,          // e.g., "fundamentals", "practice", "project"
      status: String,            // e.g., "locked", "in-progress", "completed"
      tasks: [
        {
          title: String,         // e.g., "Prepare for admissions interview"
          completed: Boolean     // e.g., false
        }
      ]
    }
  ],
  resources: [
    {
      title: String,             // e.g., "MDN JavaScript Guide"
      type: String,              // e.g., "documentation", "course", "video"
      url: String,               // e.g., "https://developer.mozilla.org/"
      reason: String             // e.g., why this resource fits the learner now
    }
  ],
  futureYou: {
    title: String,               // e.g., "Front-End Software Engineer"
    summary: String,             // e.g., projected career direction
    roles: [String],             // e.g., adjacent role titles to explore
    companies: [
      {
        name: String,            // e.g., "Accenture"
        reason: String           // e.g., why this company is worth researching
      }
    ],
    opportunityTypes: [
      {
        title: String,           // e.g., "Portfolio project"
        reason: String           // e.g., why this experience builds readiness
      }
    ],
    networkingActions: [String], // e.g., concrete outreach actions
    nextOpportunity: String      // e.g., the most immediate career-building step
  }
};

const VALID_WAYPOINT_STATUSES = new Set([
  "completed",
  "in-progress",
  "locked",
  "not-started",
  "pending"
]);

const VALID_RESOURCE_TYPES = new Set([
  "book",
  "video",
  "course",
  "documentation",
  "worksheet",
  "website"
]);

class RoadmapValidationError extends Error {
  constructor(details) {
    super("AI roadmap response failed schema validation");
    this.name = "RoadmapValidationError";
    this.details = details;
  }
}

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
app.post("/journey/generate", async (req, res) => {
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

  } catch (error) {
    // Handle any errors that occur
    console.error('Error generating roadmap:', error);

    if (isRateLimitError(error)) {
      const waitSeconds = getRateLimitWaitSeconds(error);

      return res.status(429).json({
        error: `Our Path Roadmap Generator is temporarily unavailable. Please try again in ${waitSeconds} seconds`,
        retryAfterSeconds: waitSeconds
      });
    }

    if (error instanceof RoadmapValidationError) {
      return res.status(502).json({
        error: "Roadmap generator returned an invalid response. Please try again.",
        details: error.details
      });
    }

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

// Ask Compass endpoint:
// The frontend sends the clicked assistant question plus the current journey state.
// The backend owns the LLM call so API keys and prompt rules never live in the browser.
app.post("/assistant/ask", async (req, res) => {
  try {
    const { question, journey, userProfile, journeyProgressChart } = req.body;

    // The selected button text becomes the user's Ask Compass question.
    if (!isNonEmptyString(question)) {
      return res.status(400).json({
        error: "Missing required field: question"
      });
    }

    // Journey data is required so the assistant answers from the user's roadmap,
    // not from generic career advice.
    if (!journey || typeof journey !== "object") {
      return res.status(400).json({
        error: "Missing required field: journey"
      });
    }

    // Generate one concise, dashboard-sized response grounded in the journey data.
    const answer = await generateAskCompassResponse({
      question,
      journey,
      userProfile: userProfile && typeof userProfile === "object" ? userProfile : {},
      journeyProgressChart:
        journeyProgressChart && typeof journeyProgressChart === "object"
          ? journeyProgressChart
          : {}
    });

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error generating Ask Compass response:", error);

    if (isRateLimitError(error)) {
      const waitSeconds = getRateLimitWaitSeconds(error);

      return res.status(429).json({
        error: `Ask Compass is temporarily unavailable. Please try again in ${waitSeconds} seconds`,
        retryAfterSeconds: waitSeconds
      });
    }

    res.status(500).json({
      error: "Ask Compass could not answer right now. Please try again."
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

  const prompt = `${roadmapPromptTemplate}

Generate a roadmap for the following learner:

User Type: ${u.userType}
Career Goal: ${u.careerGoal}
Experience Level: ${u.experienceLevel}
Weekly Time Commitment: ${u.weeklyTimeCommitment}
Existing Skills: ${JSON.stringify(u.existingSkills ?? [])}
Learning Interests: ${JSON.stringify(u.learningInterests ?? [])}
Target Timeline: ${u.targetTimeline}
Biggest Challenge: ${u.biggestChallenge}
Additional Notes: ${u.additionalNotes}
`;

  // Call an AI model.
  const interaction = await ai.interactions.create
    (
      {
        model: "gemini-3.5-flash",
        input: prompt,
      }
    );
  // Translate the text into a dictionary.
  const roadmap = parseRoadmapResponse(interaction.output_text);
  validateRoadmapResponse(roadmap);
  return roadmap;
}

function getAskCompassInstruction(question) {
  // Each button gets a slightly different instruction so the same assistant
  // can answer milestone, resume, interview, networking, and resource questions.
  const instructions = {
    "Explain my current milestone":
      "Explain the user's current milestone in simple, encouraging terms. Include what it means, why it matters for their destination, and what completion looks like.",
    "What should I work on this week?":
      "Recommend the highest-impact task for this week based on incomplete roadmap tasks. Explain why it matters and give one practical next step.",
    "Help me improve my resume":
      "Give resume advice based on the user's destination, current stage, and roadmap progress. Suggest 2-3 resume improvements and one concrete bullet they could draft.",
    "Prepare me for interviews":
      "Create a short interview prep recommendation based on the user's current milestone and destination. Include one likely topic, one practice question, and one prep action.",
    "Show networking ideas":
      "Suggest networking ideas relevant to the user's journey and Per Scholas background. Include two outreach targets and one short message template.",
    "Find learning resources":
      "Recommend learning resource types based on the user's current milestone and incomplete tasks. Do not invent specific links unless provided. Suggest what to search for and how to use it."
  };

  return instructions[question] ?? "Answer the user's Ask Compass question using the provided journey state.";
}

async function generateAskCompassResponse({ question, journey, userProfile, journeyProgressChart }) {
  // This prompt is intentionally strict:
  // - use the roadmap/progress chart as source of truth
  // - avoid inventing user progress or resources
  // - keep responses short enough for the dashboard chat panel
  const prompt = `
You are Ask Compass, a warm, concise AI career coach for Per Scholas learners and alumni.

Use the provided journey data as your source of truth. Be encouraging, specific, and practical.
Do not invent completed progress, tasks, resources, opportunities, or user history. If you make a suggestion, clearly frame it as a suggestion.
Keep the answer short enough for a dashboard chat panel: 80-140 words.
You may start with the learner's first name, but do not add a separate greeting such as "Hi", "Hello", or "Hey".
Do not use markdown tables. Avoid long lists. End with one clear next action.

Selected Ask Compass question:
${question}

Response goal:
${getAskCompassInstruction(question)}

User profile:
${JSON.stringify(userProfile, null, 2)}

Journey:
${JSON.stringify(journey, null, 2)}

Journey progress chart:
${JSON.stringify(journeyProgressChart, null, 2)}
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
  });

  return String(interaction.output_text ?? "").trim();
}

function parseRoadmapResponse(outputText) {
  const trimmedOutput = String(outputText ?? "").trim();
  const unfencedOutput = trimmedOutput
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const jsonStart = unfencedOutput.indexOf("{");
  const jsonEnd = unfencedOutput.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new RoadmapValidationError(["Response did not contain a JSON object"]);
  }

  try {
    return JSON.parse(unfencedOutput.slice(jsonStart, jsonEnd + 1));
  } catch (error) {
    throw new RoadmapValidationError([`Response was not valid JSON: ${error.message}`]);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRoadmapResponse(roadmap) {
  const errors = [];

  if (!roadmap || typeof roadmap !== "object" || Array.isArray(roadmap)) {
    throw new RoadmapValidationError(["Response must be a JSON object"]);
  }

  ["destination", "currentStage", "nextStep"].forEach((fieldName) => {
    if (!isNonEmptyString(roadmap[fieldName])) {
      errors.push(`${fieldName} must be a non-empty string`);
    }
  });

  if (!Array.isArray(roadmap.waypoints)) {
    errors.push("waypoints must be an array");
  } else {
    if (roadmap.waypoints.length < 3 || roadmap.waypoints.length > 6) {
      errors.push("waypoints must include between 3 and 6 items");
    }

    roadmap.waypoints.forEach((waypoint, waypointIndex) => {
      const waypointLabel = `waypoints[${waypointIndex}]`;

      if (!waypoint || typeof waypoint !== "object" || Array.isArray(waypoint)) {
        errors.push(`${waypointLabel} must be an object`);
        return;
      }

      ["title", "description", "category"].forEach((fieldName) => {
        if (!isNonEmptyString(waypoint[fieldName])) {
          errors.push(`${waypointLabel}.${fieldName} must be a non-empty string`);
        }
      });

      if (!VALID_WAYPOINT_STATUSES.has(waypoint.status)) {
        errors.push(
          `${waypointLabel}.status must be one of ${Array.from(VALID_WAYPOINT_STATUSES).join(", ")}`
        );
      }

      if (!Array.isArray(waypoint.tasks)) {
        errors.push(`${waypointLabel}.tasks must be an array`);
        return;
      }

      if (waypoint.tasks.length < 3 || waypoint.tasks.length > 6) {
        errors.push(`${waypointLabel}.tasks must include between 3 and 6 items`);
      }

      waypoint.tasks.forEach((task, taskIndex) => {
        const taskLabel = `${waypointLabel}.tasks[${taskIndex}]`;

        if (!task || typeof task !== "object" || Array.isArray(task)) {
          errors.push(`${taskLabel} must be an object`);
          return;
        }

        if (!isNonEmptyString(task.title)) {
          errors.push(`${taskLabel}.title must be a non-empty string`);
        }

        if (typeof task.completed !== "boolean") {
          errors.push(`${taskLabel}.completed must be a boolean`);
        }
      });
    });
  }

  if (!Array.isArray(roadmap.resources)) {
    errors.push("resources must be an array");
  } else {
    if (roadmap.resources.length < 3 || roadmap.resources.length > 5) {
      errors.push("resources must include between 3 and 5 items");
    }

    roadmap.resources.forEach((resource, resourceIndex) => {
      const resourceLabel = `resources[${resourceIndex}]`;

      if (!resource || typeof resource !== "object" || Array.isArray(resource)) {
        errors.push(`${resourceLabel} must be an object`);
        return;
      }

      ["title", "reason"].forEach((fieldName) => {
        if (!isNonEmptyString(resource[fieldName])) {
          errors.push(`${resourceLabel}.${fieldName} must be a non-empty string`);
        }
      });

      if (!VALID_RESOURCE_TYPES.has(resource.type)) {
        errors.push(
          `${resourceLabel}.type must be one of ${Array.from(VALID_RESOURCE_TYPES).join(", ")}`
        );
      }

      if (
        resource.url !== undefined &&
        resource.url !== null &&
        typeof resource.url !== "string"
      ) {
        errors.push(`${resourceLabel}.url must be a string when provided`);
      }
    });
  }

  if (!roadmap.futureYou || typeof roadmap.futureYou !== "object" || Array.isArray(roadmap.futureYou)) {
    errors.push("futureYou must be an object");
  } else {
    ["title", "summary", "nextOpportunity"].forEach((fieldName) => {
      if (!isNonEmptyString(roadmap.futureYou[fieldName])) {
        errors.push(`futureYou.${fieldName} must be a non-empty string`);
      }
    });

    if (!Array.isArray(roadmap.futureYou.roles)) {
      errors.push("futureYou.roles must be an array");
    } else if (roadmap.futureYou.roles.length !== 3) {
      errors.push("futureYou.roles must include exactly 3 items");
    } else {
      roadmap.futureYou.roles.forEach((role, roleIndex) => {
        if (!isNonEmptyString(role)) {
          errors.push(`futureYou.roles[${roleIndex}] must be a non-empty string`);
        }
      });
    }

    if (!Array.isArray(roadmap.futureYou.companies)) {
      errors.push("futureYou.companies must be an array");
    } else if (roadmap.futureYou.companies.length !== 3) {
      errors.push("futureYou.companies must include exactly 3 items");
    } else {
      roadmap.futureYou.companies.forEach((company, companyIndex) => {
        const companyLabel = `futureYou.companies[${companyIndex}]`;

        if (!company || typeof company !== "object" || Array.isArray(company)) {
          errors.push(`${companyLabel} must be an object`);
          return;
        }

        ["name", "reason"].forEach((fieldName) => {
          if (!isNonEmptyString(company[fieldName])) {
            errors.push(`${companyLabel}.${fieldName} must be a non-empty string`);
          }
        });
      });
    }

    if (!Array.isArray(roadmap.futureYou.opportunityTypes)) {
      errors.push("futureYou.opportunityTypes must be an array");
    } else if (roadmap.futureYou.opportunityTypes.length !== 3) {
      errors.push("futureYou.opportunityTypes must include exactly 3 items");
    } else {
      roadmap.futureYou.opportunityTypes.forEach((opportunity, opportunityIndex) => {
        const opportunityLabel = `futureYou.opportunityTypes[${opportunityIndex}]`;

        if (!opportunity || typeof opportunity !== "object" || Array.isArray(opportunity)) {
          errors.push(`${opportunityLabel} must be an object`);
          return;
        }

        ["title", "reason"].forEach((fieldName) => {
          if (!isNonEmptyString(opportunity[fieldName])) {
            errors.push(`${opportunityLabel}.${fieldName} must be a non-empty string`);
          }
        });
      });
    }

    if (!Array.isArray(roadmap.futureYou.networkingActions)) {
      errors.push("futureYou.networkingActions must be an array");
    } else if (roadmap.futureYou.networkingActions.length !== 3) {
      errors.push("futureYou.networkingActions must include exactly 3 items");
    } else {
      roadmap.futureYou.networkingActions.forEach((action, actionIndex) => {
        if (!isNonEmptyString(action)) {
          errors.push(`futureYou.networkingActions[${actionIndex}] must be a non-empty string`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new RoadmapValidationError(errors);
  }
}

function isRateLimitError(error) {
  return (
    error?.status === 429 ||
    error?.statusCode === 429 ||
    error?.code === 429 ||
    error?.code === "429" ||
    /429|rate limit|quota/i.test(String(error?.message ?? ""))
  );
}

function getHeaderValue(headers, headerName) {
  if (!headers) {
    return undefined;
  }

  if (typeof headers.get === "function") {
    return headers.get(headerName);
  }

  return headers[headerName] ?? headers[headerName.toLowerCase()];
}

function parseRetryAfterSeconds(retryAfter) {
  if (!retryAfter) {
    return undefined;
  }

  const numericRetryAfter = Number.parseFloat(retryAfter);

  if (Number.isFinite(numericRetryAfter)) {
    return numericRetryAfter;
  }

  const retryDate = Date.parse(retryAfter);

  if (Number.isFinite(retryDate)) {
    return Math.max(0, (retryDate - Date.now()) / 1000);
  }

  return undefined;
}

function getRateLimitWaitSeconds(error) {
  const retryAfter =
    getHeaderValue(error?.headers, "retry-after") ??
    getHeaderValue(error?.response?.headers, "retry-after");
  const retryAfterSeconds = parseRetryAfterSeconds(retryAfter);

  if (typeof retryAfterSeconds === "number") {
    return Math.round(retryAfterSeconds) + 5;
  }

  const retryDelay =
    error?.retryDelay ??
    error?.error?.retryDelay ??
    error?.details?.retryDelay;

  if (typeof retryDelay === "number" && Number.isFinite(retryDelay)) {
    return Math.round(retryDelay) + 5;
  }

  if (typeof retryDelay === "string") {
    const retryDelaySeconds = Number.parseFloat(retryDelay);

    if (Number.isFinite(retryDelaySeconds)) {
      return Math.round(retryDelaySeconds) + 5;
    }
  }

  return 65;
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
async function startServer() {
  roadmapPromptTemplate = await readFile(ROADMAP_PROMPT_PATH, "utf8");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`POST /journey/generate - Generate a learning roadmap`);
    console.log(`POST /assistant/ask - Answer an Ask Compass question`);
    console.log(`GET /roadmap/1234 - Retrieve roadmap 1234`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
