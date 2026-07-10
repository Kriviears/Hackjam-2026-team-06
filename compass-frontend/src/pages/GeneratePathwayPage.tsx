import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CircleUserRound,
  Compass,
  Home,
  LoaderCircle,
  Map,
  Settings,
  UserRound,
  Library,
  Route,
  ChartNoAxesColumnIncreasing,
  Sparkles,
  Target,
} from "lucide-react";

import type {
  JourneyRequest,
  JourneyResponse,
} from "../types/journey";

import techLandscape from "../assets/tech-landscape.png";
import compassLogo from "../assets/compass-logo.png";
import pathwayCompass from "../assets/pathwaycompass.png";

import "./GeneratePathwayPage.css";

interface GeneratingLocationState {
  formData?: JourneyRequest;
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
    description: "Reviewing your desired career destination.",
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: "Assessing Your Experience",
    description: "Evaluating your current skills and experience.",
    icon: CircleUserRound,
  },
  {
    id: 3,
    title: "Identifying Your Starting Point",
    description: "Determining where your learning journey begins.",
    icon: Target,
  },
  {
    id: 4,
    title: "Mapping Your Learning Path",
    description: "Creating your personalized sequence of milestones.",
    icon: Map,
  },
  {
    id: 5,
    title: "Finding Recommended Resources",
    description: "Selecting resources that support your goals.",
    icon: Route,
  },
  {
    id: 6,
    title: "Connecting Career Opportunities",
    description: "Matching projects and career-building experiences.",
    icon: BriefcaseBusiness,
  },
];

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Roadmap", icon: Route },
  { label: "Skills & Progress", icon: ChartNoAxesColumnIncreasing },
  { label: "Resources", icon: Library },
  { label: "AI Assistant", icon: Sparkles },
  { label: "Profile", icon: UserRound },
  { label: "Settings", icon: Settings },
];

const mockJourneyResponse: JourneyResponse = {
  destination: "Data Analyst",
  currentStage: "Get Your Bearings",
  progressPercent: 0,
  nextStep: "Complete your first SQL fundamentals lesson",
  waypoints: [
    {
      title: "Get Your Bearings",
      description:
        "Review your current skills, goals, experience, and available learning time.",
      category: "Orientation",
      status: "current",
    },
    {
      title: "Build Core Skills",
      description:
        "Develop foundational knowledge in SQL, Excel, Python, and data analysis.",
      category: "Technical Skills",
      status: "locked",
    },
    {
      title: "Create Real-World Projects",
      description:
        "Apply your skills through portfolio projects and practical challenges.",
      category: "Portfolio",
      status: "locked",
    },
    {
      title: "Gain Practical Experience",
      description:
        "Build experience through collaboration, volunteer work, or internships.",
      category: "Experience",
      status: "locked",
    },
    {
      title: "Prepare for Your Career",
      description:
        "Strengthen your résumé, portfolio, interview skills, and professional presence.",
      category: "Career Preparation",
      status: "locked",
    },
    {
      title: "Launch Your Career",
      description:
        "Begin applying for opportunities while continuing to grow your skills.",
      category: "Career Launch",
      status: "locked",
    },
  ],
};

function mockGenerateRoadmap(
  requestData?: JourneyRequest
): Promise<JourneyResponse> {
  console.log("Generating roadmap from:", requestData);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        ...mockJourneyResponse,
        destination:
          requestData?.careerGoal.trim() ||
          mockJourneyResponse.destination,
      });
    }, 9000);
  });
}

export default function GeneratePathwayPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData } =
    (location.state as GeneratingLocationState | null) ?? {};

  const [progress, setProgress] = useState(4);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visibleWaypoints, setVisibleWaypoints] = useState(0);
  const [roadmap, setRoadmap] = useState<JourneyResponse | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function buildRoadmap() {
      try {
        const response = await mockGenerateRoadmap(formData);

        if (!isMounted) {
          return;
        }

        setRoadmap(response);
        setCompletedSteps(generationSteps.map((step) => step.id));
        setActiveStep(generationSteps.length);
        setVisibleWaypoints(response.waypoints.length);
        setProgress(100);
        setIsComplete(true);
      } catch (error) {
        console.error("Roadmap generation failed:", error);

        if (isMounted) {
          setErrorMessage(
            "Compass could not generate your roadmap. Please try again."
          );
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

  const previewWaypoints =
    roadmap?.waypoints ?? mockJourneyResponse.waypoints;

  const currentStatus = getStatusMessage(progress, isComplete);

  function handleViewDashboard() {
    if (!roadmap) {
      return;
    }

    navigate("/dashboard", {
      replace: true,
      state: {
        roadmap,
        formData,
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
      <aside className="generate-sidebar">
        <div className="generate-brand">
          <img
            src={compassLogo}
            alt="Compass"
            className="generate-brand-logo"
          />

          <div>
            <p className="generate-brand-name">COMPASS</p>
            <p className="generate-brand-tagline">
              Find Your Direction in Tech
            </p>
          </div>
        </div>

        <nav className="generate-nav" aria-label="Compass navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a href="#" key={item.label}>
                <Icon size={21} strokeWidth={1.9} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <section className="generate-ai-note">
          <p className="generate-ai-note-title">
            <Sparkles size={17} />
            AI is working for you
          </p>

          <p>
            Compass is analyzing your goals, skills, and interests to
            create a personalized path designed for your success.
          </p>

          <Compass className="generate-ai-note-compass" strokeWidth={1.1} />
        </section>
      </aside>

      <main className="generate-page">
        <header className="generate-header">
          <div className="generate-profile">
            <button type="button" aria-label="Notifications">
              <Bell size={21} />
            </button>

            <div className="generate-avatar">FA</div>

            <span>Fabiola A.</span>
          </div>
        </header>

        <section className="generate-intro">
          <h1>
            {isComplete
              ? "Your Pathway Is Ready"
              : "Generating Your Pathway"}
          </h1>

          <p>
            Our AI Compass is analyzing your information and building a
            personalized roadmap just for you.
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
                ? "Your personalized roadmap is complete"
                : "Building your personalized roadmap..."}
            </p>

            <strong className="generate-progress-number">
              {progress}%
            </strong>

            <div
              className="generate-progress-track"
              aria-label={`${progress}% complete`}
            >
              <div
                className="generate-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="generate-status-message">
              {currentStatus}
            </p>

            {isComplete && (
              <button
                type="button"
                className="generate-dashboard-button"
                onClick={handleViewDashboard}
              >
                View My Dashboard
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
              {previewWaypoints.slice(0, 4).map((waypoint, index) => {
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

        {errorMessage && (
          <section className="generate-error" role="alert">
            <h2>We lost our direction.</h2>
            <p>{errorMessage}</p>

            <button type="button" onClick={handleTryAgain}>
              Try Again
            </button>
          </section>
        )}
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
