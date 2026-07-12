import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Home,
  LoaderCircle,
  Map,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import type {
  JourneyRequest,
  JourneyResponse,
  Waypoint,
  UserProfile,
} from "../types/journey";
import techLandscape from "../assets/tech-landscape.png";
import pathwayCompass from "../assets/pathwaycompass.png";

import "./GeneratePathwayPage.css";

interface GeneratingLocationState {
  formData?: JourneyRequest;
  userProfile?: UserProfile;
}

interface GenerationStep {
  id: number;
  title: string;
  description: string;
  icon: typeof BrainCircuit;
}

const generationSteps: GenerationStep[] = [
  {
    id: 1,
    title: "Understanding Your Goals",
    description: "Analyzing your career aspirations...",
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: "Assessing Your Current Skills",
    description: "Reviewing your experience and strengths...",
    icon: CircleUserRound,
  },
  {
    id: 3,
    title: "Identifying Your Career Destination",
    description: "Finding the best career fit for you...",
    icon: Target,
  },
  {
    id: 4,
    title: "Mapping Learning Pathway",
    description: "Creating your step-by-step learning journey...",
    icon: Map,
  },
  {
    id: 5,
    title: "Finding Recommended Resources",
    description: "Curating the best courses, tools, and materials...",
    icon: Route,
  },
  {
    id: 6,
    title: "Connecting Projects & Opportunities",
    description: "Matching real-world projects and opportunities...",
    icon: BriefcaseBusiness,
  },
];

const JOURNEY_GENERATE_ENDPOINT = "http://localhost:8000/journey/generate";
const MIN_GENERATION_TIME_MS = 7000;

type RawWaypoint = {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  status?: unknown;
  tasks?: unknown;
};

type RawWaypointTask = {
  title?: unknown;
  completed?: unknown;
};

type RawJourneyResponse = Partial<Omit<JourneyResponse, "waypoints">> & {
  waypoints?: unknown;
};

type ApiErrorResponse = {
  error?: unknown;
};

function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeWaypointStatus(
  status: unknown,
  index: number
): Waypoint["status"] {
  if (status === "completed" || status === "in-progress") {
    return status;
  }

  if (status === "not-started" || status === "locked") {
    return status;
  }

  if (status === "pending") {
    return index === 0 ? "in-progress" : "locked";
  }

  return index === 0 ? "in-progress" : "locked";
}

function normalizeTaskCompletion(completed: unknown, waypointStatus: Waypoint["status"]) {
  if (typeof completed === "boolean") {
    return completed;
  }

  if (typeof completed === "string") {
    return completed.toLowerCase() === "true";
  }

  return waypointStatus === "completed";
}

function createFallbackTasks(waypointTitle: string, waypointStatus: Waypoint["status"]) {
  return [
    {
      title: `Review requirements for ${waypointTitle}`,
      completed: waypointStatus === "completed" || waypointStatus === "in-progress",
    },
    {
      title: `Complete the main action for ${waypointTitle}`,
      completed: waypointStatus === "completed",
    },
    {
      title: `Document progress for ${waypointTitle}`,
      completed: waypointStatus === "completed",
    },
  ];
}

function normalizeWaypointTasks(
  rawTasks: unknown,
  waypointTitle: string,
  waypointStatus: Waypoint["status"]
) {
  if (!Array.isArray(rawTasks) || rawTasks.length === 0) {
    return createFallbackTasks(waypointTitle, waypointStatus);
  }

  const normalizedTasks = rawTasks.slice(0, 6).map((rawTask, index) => {
    const task =
      rawTask && typeof rawTask === "object"
        ? (rawTask as RawWaypointTask)
        : {};

    return {
      title: asText(task.title, `${waypointTitle} task ${index + 1}`),
      completed: normalizeTaskCompletion(task.completed, waypointStatus),
    };
  });

  if (normalizedTasks.length >= 3) {
    return normalizedTasks;
  }

  return [
    ...normalizedTasks,
    ...createFallbackTasks(waypointTitle, waypointStatus).slice(
      normalizedTasks.length,
      3
    ),
  ];
}

function normalizeWaypoints(rawWaypoints: unknown, formData: JourneyRequest) {
  const waypointArray = Array.isArray(rawWaypoints)
    ? rawWaypoints.slice(0, 6)
    : [];
  const fallbackCategory =
    formData.learningInterests[0] ?? formData.careerGoal ?? "Career Skills";

  if (waypointArray.length === 0) {
    const status = "in-progress" as const;
    const title = "Start Your Learning Path";

    return [
      {
        title,
        description: `Begin building the skills needed for ${formData.careerGoal || "your target career"}.`,
        category: fallbackCategory,
        status,
        tasks: createFallbackTasks(title, status),
      },
    ];
  }

  return waypointArray.map((rawWaypoint, index) => {
    const waypoint =
      rawWaypoint && typeof rawWaypoint === "object"
        ? (rawWaypoint as RawWaypoint)
        : {};

    const title = asText(waypoint.title, `Waypoint ${index + 1}`);
    const status = normalizeWaypointStatus(waypoint.status, index);

    return {
      title,
      description: asText(
        waypoint.description,
        "Complete this milestone to keep moving toward your career goal."
      ),
      category: asText(waypoint.category, fallbackCategory),
      status,
      tasks: normalizeWaypointTasks(waypoint.tasks, title, status),
    };
  });
}

function calculateJourneyProgress(waypoints: Waypoint[]) {
  const taskTotals = waypoints.reduce(
    (totals, waypoint) => {
      totals.total += waypoint.tasks.length;
      totals.completed += waypoint.tasks.filter((task) => task.completed).length;
      return totals;
    },
    { completed: 0, total: 0 }
  );

  if (taskTotals.total === 0) {
    return 0;
  }

  return Math.round((taskTotals.completed / taskTotals.total) * 100);
}

function normalizeGeneratedRoadmap(
  rawRoadmap: RawJourneyResponse,
  formData: JourneyRequest
): JourneyResponse {
  const waypoints = normalizeWaypoints(rawRoadmap.waypoints, formData);
  const currentWaypoint =
    waypoints.find((waypoint) => waypoint.status === "in-progress") ??
    waypoints.find((waypoint) => waypoint.status !== "completed") ??
    waypoints[0];

  return {
    id: asText(rawRoadmap.id, `roadmap-${Date.now()}`),
    destination: asText(rawRoadmap.destination, formData.careerGoal),
    currentStage: asText(rawRoadmap.currentStage, currentWaypoint.title),
    progressPercent: calculateJourneyProgress(waypoints),
    nextStep: asText(rawRoadmap.nextStep, currentWaypoint.title),
    userType: formData.userType,
    weeklyCommitment: formData.weeklyTimeCommitment,
    waypoints,
  };
}

async function requestRoadmap(
  formData: JourneyRequest
): Promise<JourneyResponse> {
  const response = await fetch(JOURNEY_GENERATE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;

      if (typeof errorBody.error === "string" && errorBody.error.trim()) {
        message = errorBody.error.trim();
      }
    } catch {
      // If the server did not send JSON, keep the status-based fallback.
    }

    throw new Error(message);
  }

  const rawRoadmap = (await response.json()) as RawJourneyResponse;

  return normalizeGeneratedRoadmap(rawRoadmap, formData);
}

export default function GeneratePathwayPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData } =
    (location.state as GeneratingLocationState | null) ?? {};
  const userProfile =
    (location.state as GeneratingLocationState | null)?.userProfile ??
    (formData
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
      : undefined);
  const firstName = userProfile?.firstName.trim();
  const possessiveName = firstName ? `${firstName}'s` : "Your";

  const [progress, setProgress] = useState(4);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visibleWaypoints, setVisibleWaypoints] = useState(0);
  const [roadmap, setRoadmap] = useState<JourneyResponse | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!formData) {
      setErrorMessage(
        "No onboarding information was found. Please complete onboarding again."
      );
      return;
    }

    let isMounted = true;
    const onboardingData = formData;

    async function buildRoadmap() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [generatedRoadmap] = await Promise.all([
          requestRoadmap(onboardingData),
          new Promise((resolve) =>
            window.setTimeout(resolve, MIN_GENERATION_TIME_MS)
          ),
        ]);

        if (!isMounted) {
          return;
        }

        setRoadmap(generatedRoadmap);
        setCompletedSteps(generationSteps.map((step) => step.id));
        setActiveStep(generationSteps.length);
        setVisibleWaypoints(generatedRoadmap.waypoints.length);
        setProgress(100);
        setIsComplete(true);
      } catch (error) {
        console.error("Roadmap generation failed:", error);

        if (isMounted) {
          setErrorMessage(
            error instanceof Error && error.message
              ? error.message
              : "Compass could not generate your roadmap. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    buildRoadmap();

    return () => {
      isMounted = false;
    };
  }, [formData]);

  useEffect(() => {
    if (isComplete || errorMessage) {
      return;
    }

    const progressInterval = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return 92;
        }

        if (currentProgress < 35) {
          return Math.min(currentProgress + 3, 92);
        }

        if (currentProgress < 70) {
          return Math.min(currentProgress + 2, 92);
        }

        return Math.min(currentProgress + 1, 92);
      });
    }, 350);

    return () => {
      window.clearInterval(progressInterval);
    };
  }, [isComplete, errorMessage]);

  useEffect(() => {
    if (isComplete || errorMessage) {
      return;
    }

    const stepInterval = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= generationSteps.length) {
          return generationSteps.length;
        }

        setCompletedSteps((currentCompletedSteps) => {
          if (currentCompletedSteps.includes(currentStep)) {
            return currentCompletedSteps;
          }

          return [...currentCompletedSteps, currentStep];
        });

        return currentStep + 1;
      });
    }, 1400);

    return () => {
      window.clearInterval(stepInterval);
    };
  }, [isComplete, errorMessage]);

  useEffect(() => {
    if (isComplete || errorMessage) {
      return;
    }

    const waypointInterval = window.setInterval(() => {
      setVisibleWaypoints((currentCount) =>
        Math.min(currentCount + 1, 3)
      );
    }, 2200);

    return () => {
      window.clearInterval(waypointInterval);
    };
  }, [isComplete, errorMessage]);

  const previewWaypoints = roadmap?.waypoints ?? [];
  const displayProgress = isComplete ? 100 : progress;

  const currentStatus = getStatusMessage(displayProgress, isComplete);
  const canViewRoadmap = isComplete && displayProgress === 100 && Boolean(roadmap);

  function handleViewRoadmap() {
    if (!roadmap) {
      return;
    }

    navigate("/roadmap", {
      state: {
        roadmap,
        userType: formData?.userType,
        userProfile,
      },
    });
  }

  function handleTryAgain() {
    window.location.reload();
  }

  return (
    <div
      className="generate-shell"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(0, 34, 82, 0.2) 0%, rgba(4, 68, 128, 0.08) 18%, rgba(255, 255, 255, 0) 34%, rgba(255, 255, 255, 0) 66%, rgba(4, 68, 128, 0.1) 82%, rgba(0, 34, 82, 0.24) 100%),
          radial-gradient(circle at 48% 34%, rgba(255, 255, 255, 0.96) 0%, rgba(248, 253, 255, 0.86) 18%, rgba(234, 246, 255, 0.48) 33%, rgba(255, 255, 255, 0.08) 52%, rgba(255, 255, 255, 0) 70%),
          linear-gradient(180deg, rgba(244, 251, 255, 0.78) 0%, rgba(231, 244, 255, 0.42) 42%, rgba(2, 61, 122, 0.06) 100%),
          url(${techLandscape})
        `,
      }}
    >
      <main className="generate-page">
        <header className="generate-header">
          <nav className="generate-top-nav" aria-label="Generate pathway navigation">
            <button type="button" onClick={() => navigate("/")}>
              <Home size={16} />
              <span>Home</span>
            </button>

            <button type="button" onClick={() => navigate("/onboarding")}>
              <span>Restart My Journey</span>
              <ArrowLeft size={16} />
            </button>
          </nav>
        </header>

        <section className="generate-intro">
          <h1>
            {isComplete
              ? `${possessiveName} Pathway Is Ready`
              : `Generating ${possessiveName} Pathway`}
          </h1>

          <p>
            {roadmap
              ? `Compass mapped ${firstName ? `${firstName}'s` : "your"} path toward ${roadmap.destination}.`
              : `Our AI Compass is analyzing ${firstName ? `${firstName}'s` : "your"} information and building a personalized roadmap.`}
          </p>
        </section>

        <section className="generate-workspace">
          <div className="generate-steps">
            {generationSteps.slice(0, 3).map((step) => (
              <GenerationStepCard
                key={step.id}
                step={step}
                activeStep={activeStep}
                completedSteps={completedSteps}
              />
            ))}
          </div>

          <section className="generate-center">
            <div
              className={
                isComplete
                  ? "compass-animation compass-animation-complete"
                  : "compass-animation"
              }
            >
              <div className="compass-ring compass-ring-outer" />
              <div className="compass-ring compass-ring-middle" />
              <div className="compass-ring compass-ring-inner" />

              <div className="compass-face">
                <img
                  src={pathwayCompass}
                  alt=""
                  className="compass-main-image"
                />

                <img
                  src={pathwayCompass}
                  alt=""
                  className="compass-inner-image"
                />
              </div>
            </div>

            <p className="generate-current-status">
              {isComplete
                ? `${possessiveName} personalized roadmap is complete`
                : isLoading
                  ? `Building ${firstName ? `${firstName}'s` : "your"} personalized roadmap...`
                  : `Preparing ${firstName ? `${firstName}'s` : "your"} personalized roadmap...`}
            </p>

            <strong className="generate-progress-number">
              {displayProgress}%
            </strong>

            <div
              className="generate-progress-track"
              aria-label={`${displayProgress}% complete`}
            >
              <div
                className="generate-progress-fill"
                style={{ width: `${displayProgress}%` }}
              />
            </div>

            <p className="generate-status-message">
              {currentStatus}
            </p>

            {errorMessage && (
              <div className="generate-inline-error" role="alert">
                <strong>We lost our direction.</strong>
                <span>{errorMessage}</span>

                <button type="button" onClick={handleTryAgain}>
                  Try Again
                </button>
              </div>
            )}

            {canViewRoadmap && (
              <button
                type="button"
                className="generate-roadmap-button"
                onClick={handleViewRoadmap}
              >
                View My Roadmap
                <Route size={19} />
              </button>
            )}
          </section>

          <div className="generate-steps">
            {generationSteps.slice(3).map((step) => (
              <GenerationStepCard
                key={step.id}
                step={step}
                activeStep={activeStep}
                completedSteps={completedSteps}
              />
            ))}
          </div>
        </section>

        <section className="generate-lower-grid">
          <div className="generate-lower-left">
            <div className="generate-road-visual" aria-hidden="true">
              {[0, 1, 2, 3].map((point) => (
                <span
                  key={point}
                  className={`road-pin road-pin-${point + 1}`}
                />
              ))}
            </div>

            <footer className="generate-footer">
              <Sparkles size={17} />

              <p>
                <strong>Did you know?</strong> Learners who follow a
                personalized roadmap are 3x more likely to achieve their
                career goals.
              </p>
            </footer>
          </div>

          <section className="waypoint-preview-section">
            <p className="waypoint-preview-label">
              <Route size={16} />
              Your Roadmap is Taking Shape
            </p>

            <div className="waypoint-timeline">
              {previewWaypoints.length === 0 && (
                <article className="waypoint-preview-card waypoint-preview-hidden">
                  <div className="waypoint-preview-number">1</div>

                  <div>
                    <p className="waypoint-discovered-label">
                      Waiting for backend response
                    </p>

                    <h3>Compass is mapping your path</h3>

                    <p className="waypoint-preview-description">
                      Your returned waypoints will appear here when generation is complete.
                    </p>
                  </div>
                </article>
              )}

              {previewWaypoints.map((waypoint, index) => {
                const isVisible = index < visibleWaypoints;

                return (
                  <article
                    key={`${waypoint.title}-${index}`}
                    className={
                      isVisible
                        ? "waypoint-preview-card waypoint-preview-visible"
                        : "waypoint-preview-card waypoint-preview-hidden"
                    }
                  >
                    <div className="waypoint-preview-number">
                      {isVisible ? (
                        index < 2 || isComplete ? (
                          <Check size={18} />
                        ) : (
                          index + 1
                        )
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div>
                      <p className="waypoint-discovered-label">
                        {isVisible
                          ? `Waypoint ${index + 1} Discovered`
                          : "Discovering next waypoint"}
                      </p>

                      <h3>
                        {isVisible
                          ? waypoint.title
                          : "Analyzing your next step"}
                      </h3>

                      <p className="waypoint-preview-description">
                        {isVisible
                          ? waypoint.description
                          : "Compass is still mapping this part of your journey."}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

interface GenerationStepCardProps {
  step: GenerationStep;
  activeStep: number;
  completedSteps: number[];
}

function GenerationStepCard({
  step,
  activeStep,
  completedSteps,
}: GenerationStepCardProps) {
  const StepIcon = step.icon;

  const isComplete = completedSteps.includes(step.id);
  const isActive = activeStep === step.id && !isComplete;
  const isWaiting = activeStep < step.id;

  return (
    <article
      className={[
        "generation-step-card",
        isComplete ? "generation-step-complete" : "",
        isActive ? "generation-step-active" : "",
        isWaiting ? "generation-step-waiting" : "",
      ].join(" ")}
    >
      <div className="generation-step-icon">
        <StepIcon size={23} />
      </div>

      <div className="generation-step-content">
        <h2>{step.title}</h2>
        <p>{step.description}</p>
      </div>

      <div className="generation-step-indicator">
        {isComplete && <Check size={18} />}

        {isActive && (
          <LoaderCircle
            size={19}
            className="generation-loader"
          />
        )}

        {isWaiting && <span className="generation-waiting-dot" />}
      </div>
    </article>
  );
}

function getStatusMessage(
  progress: number,
  isComplete: boolean
): string {
  if (isComplete) {
    return "Your destination and recommended waypoints are ready.";
  }

  if (progress < 25) {
    return "Learning more about where you are today...";
  }

  if (progress < 50) {
    return "Identifying the best direction for your goals...";
  }

  if (progress < 75) {
    return "Building your personalized sequence of milestones...";
  }

  return "Connecting your final recommendations and resources...";
}
