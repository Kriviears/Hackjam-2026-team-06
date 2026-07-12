import {
  Bell,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Code2,
  CircleUserRound,
  Compass,
  FileText,
  Flag,
  Gift,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  Map,
  MessageCircle,
  Play,
  Search,
  Settings,
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
import type { JourneyResponse, UserProfile, Waypoint } from "../types/journey";
import {
  applyStoredJourneyProgress,
  buildJourneyProgressChart,
  readJourneyProgress,
} from "../utils/journeyProgressStorage";
import compassLogo from "../assets/compass-landing-logo.png";
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

function getAssistantGreeting(firstName: string, destination: string) {
  return `Hi ${firstName}! I've been keeping track of your journey toward becoming a ${destination}.\n\nI can help you decide what to work on next.`;
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
  weeklyCommitment: "5-7 hours",
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

function buildOpportunities() {
  return [
    {
      type: "EVENT",
      title: "Per Scholas Workshop",
      match: 92,
      reason: "Frontend Development Best Practices · May 28, 2025 · Virtual",
    },
    {
      type: "JOB",
      title: "Junior Frontend Developer Role",
      match: 88,
      reason: "React · TypeScript · UI Development · Posted May 20, 2025 · Atlanta, GA",
    },
    {
      type: "NETWORKING",
      title: "Per Scholas Alumni Networking",
      match: 85,
      reason: "Connect, learn, and grow together · Jun 5, 2025 · In-person",
    },
  ];
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const journey = (location.state?.journey as JourneyResponse | undefined) ?? mockupJourney;
  const userProfile =
    (location.state?.userProfile as UserProfile | undefined) ?? {
      firstName: "Fabiola",
      lastName: "",
    };
  const firstName = userProfile?.firstName.trim() || "Fabiola";
  const initials = `${userProfile?.firstName?.charAt(0) ?? "C"}${userProfile?.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const [weeklyChecked, setWeeklyChecked] = useState(() => {
    const stored = getStoredArray(storageKeys.weekly, weeklyGoals.length);
    return stored.some(Boolean) ? stored : [true, true, true, false, false];
  });
  const [todayComplete, setTodayComplete] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState(() =>
    getStoredArray(storageKeys.savedOpportunities, 3),
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

  useEffect(() => {
    window.localStorage.setItem(storageKeys.weekly, JSON.stringify(weeklyChecked));
  }, [weeklyChecked]);

  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.savedOpportunities,
      JSON.stringify(savedOpportunities),
    );
  }, [savedOpportunities]);

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

    return {
      progressPercent,
      nextWaypoint,
      completedWeekly,
      weeklyPercent: Math.round((completedWeekly / weeklyGoals.length) * 100),
      skills: buildSkillSnapshot(syncedJourney),
      insights: buildInsights(syncedJourney),
      opportunities: buildOpportunities(),
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
    <section className="dashboard-robo-assistant" aria-label="roboCompass assistant">
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
          <a href="#resources">
            <BookOpen size={19} />
            Resources
          </a>
          <a href="#messages">
            <MessageCircle size={19} />
            Messages
            <span className="dashboard-nav-badge">3</span>
          </a>
          <a href="#assistant">
            <Sparkles size={19} />
            AI Assistant
          </a>
          <a href="#profile">
            <CircleUserRound size={19} />
            Profile
          </a>
          <a href="#settings">
            <Settings size={19} />
            Settings
          </a>
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
              <p className="dashboard-kicker">Good evening, {firstName}!</p>
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

              <div className="dashboard-stage-stack">
                <div>
                  <Building2 size={18} />
                  <span>Current Stage</span>
                  <strong>{syncedJourney.currentStage}</strong>
                </div>
                <div>
                  <Flag size={18} />
                  <span>Current Milestone</span>
                  <strong>{dashboardData.nextWaypoint?.title ?? syncedJourney.nextStep}</strong>
                </div>
                <div>
                  <span className="dashboard-next-number">2</span>
                  <span>Next Waypoint</span>
                  <strong>{dashboardData.nextWaypoint?.description ?? syncedJourney.nextStep}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-hero-actions">
              <button
                type="button"
                className="dashboard-primary-button"
                onClick={() =>
                  navigate("/roadmap", {
                    state: {
                      roadmap: syncedJourney,
                      userType: syncedJourney.userType,
                      userProfile,
                    },
                  })
                }
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
          <DashboardCard className="dashboard-today" title="Today's Compass" icon={<Compass size={22} />}>
            <div className="dashboard-today-layout">
              <div>
                <h2>{syncedJourney.nextStep}</h2>
                <p>
                  This step will strengthen your positioning and highlight the skills
                  employers are looking for.
                </p>
                <div className="dashboard-card-actions">
                  <button type="button" className="dashboard-primary-button">
                    <Play size={15} fill="currentColor" />
                    Start This Step
                  </button>
                  <button type="button" className="dashboard-secondary-button">View Resources</button>
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
          <DashboardCard id="opportunities" className="dashboard-opportunities" title="Recommended Opportunities" icon={<BriefcaseBusiness size={22} />} action={<button type="button">View all</button>}>
            {dashboardData.opportunities.map((opportunity, index) => (
              <article className="dashboard-opportunity" key={opportunity.title}>
                <div>
                  <span>{opportunity.type}</span>
                  <h3>{opportunity.title}</h3>
                  <p>{opportunity.reason}</p>
                </div>
                <ProgressRing value={opportunity.match} label="Match" size="sm" />
                <button
                  type="button"
                  className={savedOpportunities[index] ? "active" : ""}
                  onClick={() =>
                    setSavedOpportunities((current) =>
                      current.map((saved, savedIndex) =>
                        savedIndex === index ? !saved : saved,
                      ),
                    )
                  }
                >
                  {savedOpportunities[index] ? "Saved" : "Save"}
                </button>
                <button type="button">Details</button>
              </article>
            ))}
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

          <DashboardCard className="dashboard-reward" title="Reward Progress" icon={<Gift size={22} />}>
            <div className="dashboard-gift-orb">
              <span className="dashboard-gift-box" />
            </div>
            <h3>{rewardUnlocked ? "You're halfway there! 🎉" : "You're making great progress!"}</h3>
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
