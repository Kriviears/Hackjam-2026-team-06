import {
  Bell,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Check,
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
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import DashboardCard from "../components/dashboard/DashboardCard";
import ProgressRing from "../components/dashboard/ProgressRing";
import type { JourneyResponse, UserProfile, Waypoint } from "../types/journey";
import compassLogo from "../assets/compass-landing-logo.png";
import techLandscape from "../assets/tech-landscape.png";

import "./DashboardPage.css";

const weeklyGoals = [
  "Complete one roadmap waypoint",
  "Update your LinkedIn profile",
  "Connect with two professionals or alumni",
  "Apply to three targeted opportunities",
  "Practice one interview question",
];

const storageKeys = {
  weekly: "compass-dashboard-weekly-goals",
  savedOpportunities: "compass-dashboard-saved-opportunities",
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
  const waypointProgress = getWaypointProgress(journey.waypoints);
  const categories = journey.waypoints.map((waypoint) => waypoint.category.toLowerCase());
  const hasPortfolio = categories.some((category) => category.includes("portfolio") || category.includes("project"));
  const hasCareer = categories.some((category) => category.includes("career") || category.includes("interview"));
  const hasNetworking = categories.some((category) => category.includes("network") || category.includes("alumni"));

  /*
   * Prototype fallback values live here so the dashboard can visualize readiness
   * before the backend returns dedicated skill metrics.
   */
  return [
    { label: "Technical Foundations", value: Math.max(35, waypointProgress + 35) },
    { label: "Role-Specific Skills", value: Math.max(30, waypointProgress + 25) },
    { label: "Portfolio Development", value: hasPortfolio ? Math.max(45, waypointProgress + 20) : 38 },
    { label: "Career Readiness", value: hasCareer ? Math.max(45, waypointProgress + 18) : 42 },
    { label: "Professional Networking", value: hasNetworking ? Math.max(42, waypointProgress + 16) : 36 },
  ].map((skill) => ({ ...skill, value: Math.min(95, skill.value) }));
}

function buildInsights(journey: JourneyResponse) {
  const categories = journey.waypoints.map((waypoint) => waypoint.category).filter(Boolean);
  const categoryText = categories[0] ?? journey.currentStage;

  return [
    {
      title: "Skill Gap",
      icon: <Lightbulb size={22} />,
      text: `${categoryText} is showing up as your next growth area for ${journey.destination}.`,
      action: "Explore Skill",
    },
    {
      title: "Portfolio Recommendation",
      icon: <Sparkles size={22} />,
      text: `Build one small proof-of-skill project tied to ${journey.nextStep}.`,
      action: "Explore Project Ideas",
    },
    {
      title: "Career Readiness",
      icon: <TrendingUp size={22} />,
      text: `Keep aligning your resume, networking, and practice around ${journey.currentStage}.`,
      action: "View Recommendation",
    },
  ];
}

function buildOpportunities(journey: JourneyResponse) {
  return [
    {
      type: "Career development event",
      title: "Per Scholas Workshop",
      match: 92,
      reason: `Supports your next step: ${journey.nextStep}.`,
    },
    {
      type: "Entry-level role or internship",
      title: `${journey.destination} Starter Opportunity`,
      match: 88,
      reason: `Aligned to your destination and current stage.`,
    },
    {
      type: "Alumni or networking opportunity",
      title: "Per Scholas Alumni Networking",
      match: 85,
      reason: "Helps you connect with people who understand the path.",
    },
  ];
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const journey = location.state?.journey as JourneyResponse | undefined;
  const userProfile = location.state?.userProfile as UserProfile | undefined;
  const firstName = userProfile?.firstName.trim() || "there";
  const initials = `${userProfile?.firstName?.charAt(0) ?? "C"}${userProfile?.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const [weeklyChecked, setWeeklyChecked] = useState(() =>
    getStoredArray(storageKeys.weekly, weeklyGoals.length),
  );
  const [todayComplete, setTodayComplete] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState(() =>
    getStoredArray(storageKeys.savedOpportunities, 3),
  );
  const [connections, setConnections] = useState([false, false, false]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.weekly, JSON.stringify(weeklyChecked));
  }, [weeklyChecked]);

  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.savedOpportunities,
      JSON.stringify(savedOpportunities),
    );
  }, [savedOpportunities]);

  const dashboardData = useMemo(() => {
    if (!journey) {
      return null;
    }

    const progressPercent = Math.max(0, Math.min(100, journey.progressPercent ?? 0));
    const nextWaypoint = getNextWaypoint(journey.waypoints);
    const completedWeekly = weeklyChecked.filter(Boolean).length;

    return {
      progressPercent,
      nextWaypoint,
      completedWeekly,
      weeklyPercent: Math.round((completedWeekly / weeklyGoals.length) * 100),
      skills: buildSkillSnapshot(journey),
      insights: buildInsights(journey),
      opportunities: buildOpportunities(journey),
    };
  }, [journey, weeklyChecked]);

  if (!journey || !dashboardData) {
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

  return (
    <main
      className="dashboard-page"
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(236, 248, 255, 0.92) 0%, rgba(218, 239, 255, 0.54) 46%, rgba(7, 83, 150, 0.22) 100%),
          url(${techLandscape})
        `,
      }}
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
          <NavLink to="/roadmap" state={{ roadmap: journey, userType: journey.userType, userProfile }}>
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

        <div className="dashboard-ai-card">
          <Sparkles size={18} />
          <strong>AI Assistant</strong>
          <p>Ask anything about your journey.</p>
          <button type="button">Start a chat</button>
        </div>
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
            {initials}
          </button>
        </header>

        <section className="dashboard-hero-grid">
          <DashboardCard className="dashboard-hero">
            <div>
              <p className="dashboard-kicker">Good evening, {firstName}! 👋</p>
              <h1>Your future is taking shape.</h1>
              <span>Destination</span>
              <strong>{journey.destination}</strong>
            </div>

            <div className="dashboard-hero-progress">
              <ProgressRing value={dashboardData.progressPercent} label="Journey Progress" />

              <div className="dashboard-stage-stack">
                <div>
                  <Building2 size={18} />
                  <span>Current Stage</span>
                  <strong>{journey.currentStage}</strong>
                </div>
                <div>
                  <Flag size={18} />
                  <span>Current Milestone</span>
                  <strong>{dashboardData.nextWaypoint?.title ?? journey.nextStep}</strong>
                </div>
                <div>
                  <span className="dashboard-next-number">2</span>
                  <span>Next Waypoint</span>
                  <strong>{dashboardData.nextWaypoint?.description ?? journey.nextStep}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-hero-actions">
              <button
                type="button"
                className="dashboard-primary-button"
                onClick={() =>
                  navigate("/roadmap", {
                    state: { roadmap: journey, userType: journey.userType, userProfile },
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
              <ProgressRing value={dashboardData.weeklyPercent} label={`${dashboardData.completedWeekly}/5`} size="sm" />
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
                <h2>{journey.nextStep}</h2>
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
