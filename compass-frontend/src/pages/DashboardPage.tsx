import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Code2,
  Compass,
  FileText,
  Gift,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  Map,
  Play,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DashboardCard from "../components/dashboard/DashboardCard";
import ProgressRing from "../components/dashboard/ProgressRing";
import { askCompass } from "../services/askCompassApi";
import type { FutureYou, JourneyResponse, UserProfile, Waypoint } from "../types/journey";
import {
  applyStoredJourneyProgress,
  buildJourneyProgressChart,
  readJourneyProgress,
} from "../utils/journeyProgressStorage";
import compassLogo from "../assets/compass-landing-logo.png";
import giftCardImage from "../assets/actualGiftcard.png";
import roboCompass from "../assets/roboCompass.png";
import techLandscape from "../assets/tech-landscape.png";

import "./DashboardPage.css";

const weeklyGoals = [
  "Complete one roadmap waypoint",
  "Update your LinkedIn profile",
  "Connect with two professionals or alumni",
  "Apply to three targeted opportunities",
  "Practice one interview question",
];

const assistantOptions = [
  "Explain my current milestone",
  "What should I work on this week?",
  "Help me improve my resume",
  "Prepare me for interviews",
  "Show networking ideas",
  "Find learning resources",
];

const timelineLabels: Record<string, string> = {
  "3 months": "Within 3 months",
  "6 months": "Within 6 months",
  "12 months": "Within 12 months",
  flexible: "My timeline is flexible",
};

const weeklyCommitmentLabels: Record<string, string> = {
  "1-4 hours": "1-4 hours",
  "5-10 hours": "5-10 hours",
  "11-20 hours": "11-20 hours",
  "20+ hours": "More than 20 hours",
};

const paceMessages = {
  accelerated:
    "Your weekly commitment supports an ambitious timeline. Protect your study time and stay focused on the current waypoint.",
  onTrack:
    "Your timeline and weekly availability appear well matched. Consistent progress will be more important than speed.",
  stretch:
    "Your target may require more weekly learning time. Consider increasing your commitment or allowing more time.",
  flexible:
    "Your timeline gives you room to build skills steadily while balancing other responsibilities.",
  missing:
    "Add your target timeline and weekly availability to receive a personalized pace recommendation.",
};

function getCompassPaceRecommendation(targetTimeline?: string, weeklyCommitment?: string) {
  if (!targetTimeline || !weeklyCommitment) {
    return {
      status: "Compass Pace",
      tone: "neutral",
      message: paceMessages.missing,
    };
  }

  const shortTimeline = targetTimeline === "3 months";
  const mediumTimeline = targetTimeline === "6 months";
  const longTimeline = targetTimeline === "12 months" || targetTimeline === "flexible";
  const lowCommitment = weeklyCommitment === "1-4 hours";
  const moderateCommitment = weeklyCommitment === "5-10 hours";
  const highCommitment = weeklyCommitment === "11-20 hours" || weeklyCommitment === "20+ hours";

  if ((shortTimeline || mediumTimeline) && lowCommitment) {
    return {
      status: "Stretch Goal",
      tone: "stretch",
      message: paceMessages.stretch,
    };
  }

  if (shortTimeline && highCommitment) {
    return {
      status: "Accelerated",
      tone: "accelerated",
      message: paceMessages.accelerated,
    };
  }

  if (mediumTimeline && moderateCommitment) {
    return {
      status: "On Track",
      tone: "on-track",
      message: paceMessages.onTrack,
    };
  }

  if (longTimeline && (lowCommitment || moderateCommitment)) {
    return {
      status: "On Track",
      tone: "on-track",
      message: paceMessages.flexible,
    };
  }

  return {
    status: highCommitment ? "Accelerated" : "On Track",
    tone: highCommitment ? "accelerated" : "on-track",
    message: highCommitment ? paceMessages.accelerated : paceMessages.onTrack,
  };
}

function getAssistantGreeting(firstName: string, destination: string) {
  return `Hi ${firstName}! I've been keeping track of your journey toward becoming a ${destination}.\n\nI can help you decide what to work on next.`;
}

function getTimeOfDayGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

const storageKeys = {
  weekly: "compass-dashboard-weekly-goals",
  savedOpportunities: "compass-dashboard-saved-opportunities",
};

const mockupJourney: JourneyResponse = {
  id: "dashboard-preview",
  destination: "Front-End Software Engineer",
  currentStage: "Building Foundations",
  progressPercent: 33,
  nextStep:
    "Complete the first draft of your technical resume and compare it with three current frontend developer job descriptions.",
  userType: "currentLearner",
  weeklyCommitment: "5-10 hours",
  targetTimeline: "6 months",
  waypoints: [
    {
      title: "Establish Core Foundations",
      description: "Develop Technical Data Skills",
      category: "Technical Foundations",
      status: "in-progress",
      tasks: [
        { title: "Review HTML, CSS, and JavaScript fundamentals", completed: true },
        { title: "Practice GitHub portfolio hygiene", completed: false },
      ],
    },
    {
      title: "Build Role-Specific Skills",
      description: "Strengthen React, testing, and API fluency",
      category: "Role-Specific Skills",
      status: "pending",
      tasks: [
        { title: "Create a React component library", completed: false },
        { title: "Add testing practice to a small app", completed: false },
      ],
    },
    {
      title: "Connect Projects to Careers",
      description: "Translate project work into interview-ready stories",
      category: "Career Readiness",
      status: "pending",
      tasks: [
        { title: "Draft STAR stories from project work", completed: false },
        { title: "Prepare a portfolio walkthrough", completed: false },
      ],
    },
  ],
  resources: [
    {
      title: "MDN Learn Web Development",
      type: "documentation",
      url: "https://developer.mozilla.org/en-US/docs/Learn",
      reason:
        "Supports the current foundation-building milestone with practical HTML, CSS, and JavaScript guidance.",
    },
    {
      title: "React Official Tutorial",
      type: "documentation",
      url: "https://react.dev/learn",
      reason:
        "Helps the learner prepare for the next role-specific React milestone without jumping into advanced material.",
    },
    {
      title: "Per Scholas Career Services",
      type: "website",
      url: "https://perscholas.org/",
      reason:
        "Connects technical progress to resume, interview, and job-search support for the career readiness milestone.",
    },
  ],
  futureYou: {
    title: "Front-End Software Engineer",
    summary:
      "You are building toward a frontend role where strong fundamentals, React practice, and clear project storytelling help you show readiness.",
    roles: [
      "Junior Front-End Developer",
      "UI Developer",
      "React Developer Apprentice",
    ],
    companies: [
      {
        name: "Accenture",
        reason:
          "Research this organization because large consulting teams often include web, UI, and software delivery role families.",
      },
      {
        name: "Capital One",
        reason:
          "Explore its product and engineering teams to understand how frontend skills support customer-facing digital tools.",
      },
      {
        name: "Per Scholas employer partners",
        reason:
          "Use Career Services conversations to identify partner organizations that value entry-level technical talent.",
      },
    ],
    opportunityTypes: [
      {
        title: "Frontend portfolio project",
        reason:
          "Build a responsive React project that demonstrates components, API usage, accessibility, and clear documentation.",
      },
      {
        title: "Hackathon or community build",
        reason:
          "Practice shipping a small feature with teammates and turn the experience into interview-ready stories.",
      },
      {
        title: "Informational interviews",
        reason:
          "Ask frontend professionals how they use React, testing, and collaboration skills in day-to-day work.",
      },
    ],
    networkingActions: [
      "Connect with two Per Scholas alumni in frontend or UI roles.",
      "Ask one software engineer for feedback on your portfolio homepage.",
      "Attend one virtual meetup focused on React or accessible web design.",
    ],
    nextOpportunity:
      "Choose one frontend portfolio project and write the problem, users, and first three features before building.",
  },
};

function getStoredArray(key: string, length: number) {
  if (typeof window === "undefined") {
    return Array<boolean>(length).fill(false);
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.from({ length }, (_, index) => Boolean(parsed[index]));
  } catch {
    return Array<boolean>(length).fill(false);
  }
}

function getFutureYouOpportunityIds(futureYou?: FutureYou) {
  if (!futureYou) {
    return [];
  }

  return [
    ...futureYou.companies.map((company) => getOpportunityId("company", company.name)),
    ...futureYou.opportunityTypes.map((opportunity) =>
      getOpportunityId("experience", opportunity.title),
    ),
  ];
}

function getStoredSavedOpportunityIds(key: string, legacyOpportunityIds: string[] = []) {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");

    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return new Set(parsed);
    }

    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "boolean")) {
      return new Set(
        legacyOpportunityIds.filter((_, index) => Boolean(parsed[index])),
      );
    }
  } catch {
    return new Set<string>();
  }

  return new Set<string>();
}

function getWaypointProgress(waypoints: Waypoint[]) {
  if (waypoints.length === 0) {
    return 0;
  }

  const completed = waypoints.filter((waypoint) => waypoint.status === "completed").length;
  return Math.round((completed / waypoints.length) * 100);
}

function getNextWaypoint(waypoints: Waypoint[]) {
  return (
    waypoints.find((waypoint) => waypoint.status === "in-progress") ??
    waypoints.find((waypoint) => waypoint.status !== "completed") ??
    waypoints[0]
  );
}

function buildSkillSnapshot(journey: JourneyResponse) {
  const waypointProgress = Math.max(getWaypointProgress(journey.waypoints), journey.progressPercent ?? 0);
  const categories = journey.waypoints.map((waypoint) => waypoint.category.toLowerCase());
  const hasPortfolio = categories.some((category) => category.includes("portfolio") || category.includes("project"));
  const hasCareer = categories.some((category) => category.includes("career") || category.includes("interview"));
  const hasNetworking = categories.some((category) => category.includes("network") || category.includes("alumni"));

  /*
   * Prototype fallback values live here so the dashboard can visualize readiness
   * before the backend returns dedicated skill metrics.
   */
  return [
    { label: "Technical Foundations", value: Math.max(75, waypointProgress + 35) },
    { label: "Role-Specific Skills", value: Math.max(60, waypointProgress + 25) },
    { label: "TypeScript", value: Math.max(45, waypointProgress + 12) },
    { label: "Backend & APIs", value: hasPortfolio ? Math.max(40, waypointProgress + 7) : 40 },
    { label: "Career Readiness", value: hasCareer ? Math.max(55, waypointProgress + 18) : 55 },
    { label: "Professional Networking", value: hasNetworking ? Math.max(50, waypointProgress + 16) : 50 },
  ].map((skill) => ({ ...skill, value: Math.min(95, skill.value) }));
}

function buildInsights(journey: JourneyResponse) {
  const categories = journey.waypoints.map((waypoint) => waypoint.category).filter(Boolean);
  const categoryText = categories[0] ?? journey.currentStage;

  return [
    {
      title: "Skill Gap Detected",
      icon: <Lightbulb size={22} />,
      text: `${categoryText} appears in 72% of similar roles. Add one focused practice block this week.`,
      action: "Explore Skills",
    },
    {
      title: "Portfolio Recommendation",
      icon: <Sparkles size={22} />,
      text: "Build a project that demonstrates API integration, authentication, and responsive design.",
      action: "Explore Project Ideas",
    },
    {
      title: "Career Readiness",
      icon: <TrendingUp size={22} />,
      text: "You're making progress. Focus on portfolio storytelling and LinkedIn visibility.",
      action: "View Recommendation",
    },
  ];
}

function getFutureYou(journey: JourneyResponse): FutureYou | undefined {
  return journey.futureYou;
}

function getOpportunityId(kind: string, title: string) {
  return `${kind}:${title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const journey = (location.state?.journey as JourneyResponse | undefined) ?? mockupJourney;
  const initialOpportunityIds = getFutureYouOpportunityIds(journey.futureYou);
  const userProfile =
    (location.state?.userProfile as UserProfile | undefined) ?? {
      firstName: "Fabiola",
      lastName: "",
    };
  const firstName = userProfile?.firstName.trim() || "Fabiola";
  const timeOfDayGreeting = useMemo(() => getTimeOfDayGreeting(), []);
  const initials = `${userProfile?.firstName?.charAt(0) ?? "C"}${userProfile?.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const [weeklyChecked, setWeeklyChecked] = useState(() => {
    const stored = getStoredArray(storageKeys.weekly, weeklyGoals.length);
    return stored.some(Boolean) ? stored : [true, true, true, false, false];
  });
  const [todayComplete, setTodayComplete] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [futureYouExpanded, setFutureYouExpanded] = useState(false);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState(() =>
    getStoredSavedOpportunityIds(storageKeys.savedOpportunities, initialOpportunityIds),
  );
  const [connections, setConnections] = useState([false, false, false]);
  const [progressSyncVersion, setProgressSyncVersion] = useState(0);

  // Ask Compass UI state:
  // ready controls the delayed greeting, expanded reveals the question buttons,
  // typedLength powers the typewriter intro, and answer/error/loading handle LLM replies.
  const [assistantReady, setAssistantReady] = useState(false);
  const [assistantExpanded, setAssistantExpanded] = useState(false);
  const [assistantTypedLength, setAssistantTypedLength] = useState(0);
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [assistantError, setAssistantError] = useState("");
  const [assistantLoadingQuestion, setAssistantLoadingQuestion] = useState("");

  // Pull in the latest Roadmap-owned progress so Ask Compass answers from
  // the same journey state shown by the Dashboard progress chart.
  const syncedJourney = useMemo(
    () => applyStoredJourneyProgress(journey),
    [journey, progressSyncVersion],
  );
  const journeyProgressChart = useMemo(
    () => readJourneyProgress(journey)?.chart ?? buildJourneyProgressChart(syncedJourney),
    [journey, syncedJourney, progressSyncVersion],
  );
  const paceRecommendation = useMemo(
    () =>
      getCompassPaceRecommendation(
        syncedJourney.targetTimeline,
        syncedJourney.weeklyCommitment,
      ),
    [syncedJourney.targetTimeline, syncedJourney.weeklyCommitment],
  );
  const openRoadmap = () =>
    navigate("/roadmap", {
      state: {
        roadmap: syncedJourney,
        userType: syncedJourney.userType,
        userProfile,
      },
    });

  useEffect(() => {
    window.localStorage.setItem(storageKeys.weekly, JSON.stringify(weeklyChecked));
  }, [weeklyChecked]);

  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.savedOpportunities,
      JSON.stringify(Array.from(savedOpportunityIds)),
    );
  }, [savedOpportunityIds]);

  useEffect(() => {
    // The assistant starts with typing bubbles, then switches to the greeting.
    const greetingTimer = window.setTimeout(() => {
      setAssistantReady(true);
    }, 2400);

    return () => window.clearTimeout(greetingTimer);
  }, []);

  const assistantGreeting = useMemo(
    () => getAssistantGreeting(firstName, syncedJourney.destination),
    [firstName, syncedJourney.destination],
  );

  useEffect(() => {
    // Once the greeting is ready, reveal it one character at a time.
    if (!assistantReady) {
      setAssistantTypedLength(0);
      return;
    }

    setAssistantTypedLength(0);
    const typingTimer = window.setInterval(() => {
      setAssistantTypedLength((length) => {
        if (length >= assistantGreeting.length) {
          window.clearInterval(typingTimer);
          return length;
        }

        return length + 1;
      });
    }, 18);

    return () => window.clearInterval(typingTimer);
  }, [assistantGreeting, assistantReady]);

  useEffect(() => {
    const syncJourneyProgress = () => setProgressSyncVersion((version) => version + 1);

    window.addEventListener("storage", syncJourneyProgress);
    window.addEventListener("focus", syncJourneyProgress);

    return () => {
      window.removeEventListener("storage", syncJourneyProgress);
      window.removeEventListener("focus", syncJourneyProgress);
    };
  }, []);

  const dashboardData = useMemo(() => {
    if (!syncedJourney) {
      return null;
    }

    const progressPercent = Math.max(
      0,
      Math.min(100, journeyProgressChart.progressPercent ?? 0),
    );
    const nextWaypoint = getNextWaypoint(syncedJourney.waypoints);
    const completedWeekly = weeklyChecked.filter(Boolean).length;
    const futureYou = getFutureYou(syncedJourney);

    return {
      progressPercent,
      nextWaypoint,
      completedWeekly,
      weeklyPercent: Math.round((completedWeekly / weeklyGoals.length) * 100),
      skills: buildSkillSnapshot(syncedJourney),
      insights: buildInsights(syncedJourney),
      futureYou,
    };
  }, [syncedJourney, journeyProgressChart, weeklyChecked]);

  if (!dashboardData) {
    return (
      <main className="dashboard-page dashboard-empty">
        <DashboardCard className="dashboard-empty-card">
          <Compass size={38} />
          <h1>Your command center is waiting.</h1>
          <p>Complete onboarding to generate your roadmap and unlock your dashboard.</p>
          <button type="button" onClick={() => navigate("/onboarding")}>
            Start onboarding
          </button>
        </DashboardCard>
      </main>
    );
  }

  const rewardUnlocked = dashboardData.progressPercent >= 50;
  const futureYou = dashboardData.futureYou;
  const previewRoles = futureYou
    ? futureYou.roles.slice(0, futureYouExpanded ? futureYou.roles.length : 2)
    : [];
  const previewCompanies = futureYou
    ? futureYou.companies.slice(0, futureYouExpanded ? futureYou.companies.length : 1)
    : [];
  const previewOpportunities = futureYou
    ? futureYou.opportunityTypes.slice(
        0,
        futureYouExpanded ? futureYou.opportunityTypes.length : 1,
      )
    : [];
  const hasMoreFutureYou =
    Boolean(futureYou) &&
    (futureYou!.roles.length > 2 ||
      futureYou!.companies.length > 1 ||
      futureYou!.opportunityTypes.length > 1);

  // Called when a user clicks one of the suggested Ask Compass questions.
  // It sends the selected question plus the current journey/progress context
  // to the backend LLM route, then renders the returned answer in the panel.
  const handleAskCompassQuestion = async (question: string) => {
    setAssistantExpanded(true);
    setAssistantAnswer("");
    setAssistantError("");
    setAssistantLoadingQuestion(question);

    try {
      const answer = await askCompass({
        question,
        journey: syncedJourney,
        userProfile,
        journeyProgressChart,
      });

      setAssistantAnswer(answer);
    } catch (error) {
      setAssistantError(
        error instanceof Error
          ? error.message
          : "Ask Compass could not answer right now.",
      );
    } finally {
      setAssistantLoadingQuestion("");
    }
  };
  const askCompassPanel = (
    <section id="assistant" className="dashboard-robo-assistant" aria-label="roboCompass assistant">
      <div
        className={
          assistantReady
            ? "dashboard-robo-message dashboard-robo-message--speaking"
            : "dashboard-robo-message dashboard-robo-message--typing"
        }
        aria-live="polite"
      >
        {assistantReady ? (
          <p className="dashboard-robo-typewritten">
            {assistantGreeting.slice(0, assistantTypedLength)}
            {assistantTypedLength < assistantGreeting.length && (
              <span aria-hidden="true" className="dashboard-robo-caret" />
            )}
          </p>
        ) : (
          <div className="dashboard-robo-typing" aria-label="roboCompass is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <button
        type="button"
        className="dashboard-robo-trigger"
        aria-expanded={assistantExpanded}
        onClick={() => setAssistantExpanded(true)}
      >
        <img src={roboCompass} alt="" />
        <span>Ask Compass</span>
      </button>

      {assistantExpanded && (
        <div className="dashboard-robo-options">
          {/* Each option becomes the "question" sent to the Ask Compass LLM route. */}
          {assistantOptions.map((option) => (
            <button
              type="button"
              key={option}
              disabled={Boolean(assistantLoadingQuestion)}
              onClick={() => void handleAskCompassQuestion(option)}
            >
              {assistantLoadingQuestion === option ? "Thinking..." : option}
            </button>
          ))}
        </div>
      )}

      {(assistantLoadingQuestion || assistantAnswer || assistantError) && (
        <>
          {/* This block shows the backend LLM answer, or an error if the call fails. */}
          <div
            className={
              assistantError
                ? "dashboard-robo-answer dashboard-robo-answer--error"
                : "dashboard-robo-answer"
            }
            aria-live="polite"
          >
            {assistantLoadingQuestion && (
              <div className="dashboard-robo-typing" aria-label="Ask Compass is thinking">
                <span />
                <span />
                <span />
              </div>
            )}
            {!assistantLoadingQuestion && assistantAnswer && <p>{assistantAnswer}</p>}
            {!assistantLoadingQuestion && assistantError && <p>{assistantError}</p>}
          </div>
        </>
      )}
    </section>
  );

  return (
    <main
      className="dashboard-page"
      style={{
        "--dashboard-techscape": `url(${techLandscape})`,
      } as CSSProperties}
    >
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <img src={compassLogo} alt="Compass" />
          <strong>COMPASS</strong>
          <span>Your path. Your future.</span>
        </div>

        <nav aria-label="Dashboard navigation">
          <NavLink to="/dashboard" className="active">
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>
          <NavLink
            to="/roadmap"
            state={{ roadmap: syncedJourney, userType: syncedJourney.userType, userProfile }}
          >
            <Map size={19} />
            Roadmap
          </NavLink>
          <a href="#opportunities">
            <BriefcaseBusiness size={19} />
            Opportunities
          </a>
          <a href="#connections">
            <UsersRound size={19} />
            Connections
          </a>
          <NavLink
            to="/roadmap"
            state={{ roadmap: syncedJourney, userType: syncedJourney.userType, userProfile }}
          >
            <BookOpen size={19} />
            Resources
          </NavLink>
        </nav>

      </aside>

      <section className="dashboard-shell">
        <header className="dashboard-topbar">
          <div />
          <button type="button" aria-label="Search">
            <Search size={20} />
          </button>
          <button type="button" aria-label="Notifications" className="dashboard-notification">
            <Bell size={20} />
            <span>2</span>
          </button>
          <button type="button" className="dashboard-profile" aria-label="Profile">
            <span>{initials}</span>
            <ChevronDown size={14} />
          </button>
        </header>

        <section className="dashboard-hero-grid">
          <DashboardCard className="dashboard-hero">
            <div>
              <p className="dashboard-kicker">{timeOfDayGreeting}, {firstName}!</p>
              <h1>Your future is taking shape.</h1>
              <span>Destination</span>
              <strong>{syncedJourney.destination}</strong>
            </div>

            <div className="dashboard-hero-progress">
              <div
                className="dashboard-roadmap-progress"
                aria-label={`Journey progress ${dashboardData.progressPercent}%`}
              >
                <span className="dashboard-roadmap-progress-title">Journey Progress</span>
                <div
                  className="dashboard-roadmap-progress-chart"
                  style={{
                    background: `conic-gradient(#078aa4 ${dashboardData.progressPercent}%, rgba(219, 229, 238, 0.9) 0)`,
                  }}
                  aria-hidden="true"
                >
                  <span>{dashboardData.progressPercent}%</span>
                </div>
                <p>
                  {journeyProgressChart.completedWaypoints} of{" "}
                  {journeyProgressChart.totalWaypoints} waypoints complete
                </p>
              </div>

              <div className="dashboard-pace-card" aria-label="Compass Pace Recommendation">
                <span className="dashboard-pace-eyebrow">Compass Pace Recommendation</span>
                <strong className="dashboard-pace-status">
                  {paceRecommendation.status}
                  <span
                    className={`dashboard-pace-marker dashboard-pace-marker--${paceRecommendation.tone}`}
                    aria-hidden="true"
                  />
                </strong>
                <div className="dashboard-pace-details">
                  <div>
                    <span>Target timeline</span>
                    <b>
                      {timelineLabels[syncedJourney.targetTimeline ?? ""] ??
                        syncedJourney.targetTimeline ??
                        "Not selected"}
                    </b>
                  </div>
                  <div>
                    <span>Weekly time</span>
                    <b>
                      {weeklyCommitmentLabels[syncedJourney.weeklyCommitment ?? ""] ??
                        syncedJourney.weeklyCommitment ??
                        "Not selected"}
                    </b>
                  </div>
                </div>
                <p>{paceRecommendation.message}</p>
              </div>
            </div>

            <div className="dashboard-hero-actions">
              <button
                type="button"
                className="dashboard-primary-button"
                onClick={openRoadmap}
              >
                Continue My Roadmap
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="dashboard-secondary-button">
                Review Career Goal
              </button>
            </div>
          </DashboardCard>

          <DashboardCard className="dashboard-weekly" title="Weekly Momentum" icon={<TrendingUp size={22} />}>
            <div className="dashboard-weekly-heading">
              <strong>{dashboardData.completedWeekly} of 5 weekly goals completed</strong>
              <ProgressRing
                value={dashboardData.weeklyPercent}
                displayValue={`${dashboardData.completedWeekly}/5`}
                size="sm"
              />
            </div>

            <div className="dashboard-weekly-list">
              {weeklyGoals.map((goal, index) => (
                <label key={goal}>
                  <input
                    type="checkbox"
                    checked={weeklyChecked[index]}
                    onChange={() =>
                      setWeeklyChecked((current) =>
                        current.map((checked, checkedIndex) =>
                          checkedIndex === index ? !checked : checked,
                        ),
                      )
                    }
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>

            <div className="dashboard-weekly-bar">
              <span style={{ width: `${dashboardData.weeklyPercent}%` }} />
            </div>
            <div className="dashboard-momentum-city" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={item < dashboardData.completedWeekly ? "active" : ""}
                />
              ))}
            </div>
            <p>Small steps today. Big impact tomorrow.</p>
          </DashboardCard>
        </section>

        <section className="dashboard-main-grid">
          <DashboardCard className="dashboard-today" title="Today's Mission" icon={<Compass size={22} />}>
            <div className="dashboard-today-layout">
              <div>
                <h2>{syncedJourney.nextStep}</h2>
                <p>
                  This step will strengthen your positioning and highlight the skills
                  employers are looking for.
                </p>
                <div className="dashboard-card-actions dashboard-card-actions--today">
                  <button
                    type="button"
                    className="dashboard-primary-button"
                    onClick={openRoadmap}
                  >
                    <Play size={15} fill="currentColor" />
                    Start This Step
                  </button>
                  <button
                    type="button"
                    className="dashboard-secondary-button"
                    onClick={openRoadmap}
                  >
                    <BookOpen size={16} />
                    View Resources
                  </button>
                  <button
                    type="button"
                    className={todayComplete ? "dashboard-complete-button active" : "dashboard-complete-button"}
                    onClick={() => setTodayComplete((complete) => !complete)}
                  >
                    <Check size={16} />
                    {todayComplete ? "Completed" : "Mark Complete"}
                  </button>
                </div>
              </div>

              <div className="dashboard-resume-visual" aria-hidden="true">
                <FileText size={54} />
                <span />
                <span />
                <span />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard className="dashboard-insights" title="AI Career Insights" icon={<Sparkles size={22} />} action={<button type="button">View all</button>}>
            <div className="dashboard-insight-grid">
              {dashboardData.insights.map((insight, index) => (
                <article key={insight.title}>
                  <span>{index === 1 ? <Code2 size={22} /> : insight.icon}</span>
                  <h3>{insight.title}</h3>
                  <p>{insight.text}</p>
                  <button type="button">{insight.action} →</button>
                </article>
              ))}
            </div>
          </DashboardCard>
        </section>

        <section className="dashboard-lower-grid">
          <DashboardCard
            id="opportunities"
            className={`dashboard-opportunities dashboard-future-you ${
              futureYouExpanded ? "dashboard-future-you--expanded" : ""
            }`}
            title="Future You Opportunities"
            icon={<BriefcaseBusiness size={22} />}
            action={
              futureYou && hasMoreFutureYou ? (
                <button
                  type="button"
                  onClick={() => setFutureYouExpanded((expanded) => !expanded)}
                >
                  {futureYouExpanded ? "Show less" : "View all"}
                </button>
              ) : undefined
            }
          >
            {futureYou ? (
              <>
                <header className="future-you-header">
                  <span>Future You</span>
                  <h3>{futureYou.title}</h3>
                  <p>{futureYou.summary}</p>
                </header>

                <section className="future-you-section" aria-labelledby="future-you-roles">
                  <h4 id="future-you-roles">Roles to Explore</h4>
                  <div className="future-you-role-list">
                    {previewRoles.map((role) => (
                      <span key={role}>
                        <UsersRound size={15} />
                        {role}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="future-you-section" aria-labelledby="future-you-companies">
                  <h4 id="future-you-companies">Companies to Explore</h4>
                  <div className="future-you-item-list">
                    {previewCompanies.map((company) => {
                      const opportunityId = getOpportunityId("company", company.name);
                      const isSaved = savedOpportunityIds.has(opportunityId);

                      return (
                        <article className="dashboard-opportunity" key={opportunityId}>
                          <div>
                            <span>Company to Explore</span>
                            <h3>{company.name}</h3>
                            <p>{company.reason}</p>
                          </div>
                          <button
                            type="button"
                            className={isSaved ? "active" : ""}
                            aria-pressed={isSaved}
                            onClick={() =>
                              setSavedOpportunityIds((current) => {
                                const next = new Set(current);

                                if (next.has(opportunityId)) {
                                  next.delete(opportunityId);
                                } else {
                                  next.add(opportunityId);
                                }

                                return next;
                              })
                            }
                          >
                            {isSaved ? "Saved" : "Save"}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="future-you-section" aria-labelledby="future-you-experiences">
                  <h4 id="future-you-experiences">Experience-Building Opportunities</h4>
                  <div className="future-you-item-list">
                    {previewOpportunities.map((opportunity) => {
                      const opportunityId = getOpportunityId("experience", opportunity.title);
                      const isSaved = savedOpportunityIds.has(opportunityId);

                      return (
                        <article className="dashboard-opportunity" key={opportunityId}>
                          <div>
                            <span>Experience Builder</span>
                            <h3>{opportunity.title}</h3>
                            <p>{opportunity.reason}</p>
                          </div>
                          <button
                            type="button"
                            className={isSaved ? "active" : ""}
                            aria-pressed={isSaved}
                            onClick={() =>
                              setSavedOpportunityIds((current) => {
                                const next = new Set(current);

                                if (next.has(opportunityId)) {
                                  next.delete(opportunityId);
                                } else {
                                  next.add(opportunityId);
                                }

                                return next;
                              })
                            }
                          >
                            {isSaved ? "Saved" : "Save"}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <section className="future-you-next" aria-labelledby="future-you-next">
                  <h4 id="future-you-next">Your Next Opportunity</h4>
                  <p>{futureYou.nextOpportunity}</p>
                </section>

                {!futureYouExpanded && hasMoreFutureYou ? (
                  <span className="future-you-more-cue" aria-label="More Future You opportunities available">
                    ...
                  </span>
                ) : null}

                {futureYouExpanded ? (
                  <p className="future-you-disclaimer">
                    Career exploration recommendations are based on your Compass journey and are not verified job openings.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="future-you-empty">
                <span>Future You</span>
                <h3>{syncedJourney.destination}</h3>
                <p>
                  Generate or refresh your Compass journey to receive personalized Future You opportunities.
                </p>
              </div>
            )}
          </DashboardCard>

          <DashboardCard className="dashboard-skills" title="Skill Snapshot" icon={<Target size={22} />}>
            {dashboardData.skills.map((skill) => (
              <div className="dashboard-skill" key={skill.label}>
                <span>{skill.label}</span>
                <div><span style={{ width: `${skill.value}%` }} /></div>
                <strong>{skill.value}%</strong>
              </div>
            ))}
          </DashboardCard>

          <DashboardCard id="connections" className="dashboard-connections" title="Suggested Connections" icon={<Handshake size={22} />} action={<button type="button">View all</button>}>
            {[
              ["Per Scholas Alumni Mentor", "Learn from someone who has navigated a similar path."],
              ["Career Development Coach", "Get support with resumes, interviews, and readiness."],
              ["Peer Study Partner", "Stay accountable with someone working toward a related goal."],
            ].map(([title, reason], index) => (
              <article key={title}>
                <div>
                  <h3>{title}</h3>
                  <p>{reason}</p>
                </div>
                <button
                  type="button"
                  className={connections[index] ? "active" : ""}
                  onClick={() =>
                    setConnections((current) =>
                      current.map((sent, sentIndex) =>
                        sentIndex === index ? !sent : sent,
                      ),
                    )
                  }
                >
                  {connections[index] ? "Request Sent" : "Connect"}
                </button>
              </article>
            ))}
          </DashboardCard>

          <DashboardCard className="dashboard-reward" title="Reward Progress">
            <div className="dashboard-gift-card-visual">
              <img src={giftCardImage} alt="Gift card reward" />
            </div>
            <h3>{rewardUnlocked ? "Reward unlocked" : "Reward progress"}</h3>
            <p>
              {rewardUnlocked
                ? "Your employee-sponsored reward is now unlocked."
                : "Reach 50% of your journey to unlock an employee-sponsored reward."}
            </p>
            <div className="dashboard-reward-bar">
              <span style={{ width: `${Math.min(100, dashboardData.progressPercent * 2)}%` }} />
            </div>
            <strong>
              {rewardUnlocked
                ? "Reward unlocked"
                : `${Math.max(0, 50 - dashboardData.progressPercent)}% more to go!`}
            </strong>
            {rewardUnlocked && (
              <button type="button" onClick={() => setRewardOpen(true)}>
                Claim My Reward
              </button>
            )}
          </DashboardCard>
        </section>

        {askCompassPanel}

      </section>

      {rewardOpen && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
          <div>
            <Gift size={36} />
            <h2 id="reward-title">Reward fulfillment preview</h2>
            <p>
              In a future release, this button would connect to employee-sponsored
              reward fulfillment for eligible learners.
            </p>
            <button type="button" onClick={() => setRewardOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
