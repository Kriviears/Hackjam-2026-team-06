import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Database,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import type { RoadmapData, RoadmapWaypoint } from "../../types/roadmap";

interface WaypointDetailsProps {
  roadmap: RoadmapData;
  waypoint: RoadmapWaypoint;
  totalWaypoints: number;
}

function WaypointDetails({
  roadmap,
  waypoint,
  totalWaypoints,
}: WaypointDetailsProps) {
  const progressByStatus = {
    completed: 100,
    "in-progress": 60,
    "not-started": 0,
    locked: 0,
  };

  const skills = [
    `${waypoint.category} Basics`,
    waypoint.title,
    "Practice milestone",
    "Portfolio evidence",
    "Reflection notes",
  ];

  const completedSkills =
    waypoint.status === "completed"
      ? skills.length
      : waypoint.status === "in-progress"
        ? 2
        : 0;

  const progress = progressByStatus[waypoint.status];
  const estimatedTime =
    waypoint.status === "completed"
      ? "Complete"
      : waypoint.status === "locked"
        ? "Locked"
        : "4 weeks";
  const completedWaypoints = roadmap.waypoints.filter(
    (roadmapWaypoint) => roadmapWaypoint.status === "completed",
  ).length;
  const journeyProgressPercent =
    totalWaypoints > 0
      ? Math.round((completedWaypoints / totalWaypoints) * 100)
      : 0;

  return (
    <aside className="waypoint-panel">
      <section className="waypoint-journey-progress-card">
        <span>Journey Progress</span>
        <strong>
          {completedWaypoints} of {totalWaypoints} waypoints complete ·{" "}
          {journeyProgressPercent}%
        </strong>
      </section>

      <section className="waypoint-summary-card">
        <p className="waypoint-eyebrow">
          Waypoint {waypoint.id} of {totalWaypoints}
        </p>

        <div className="waypoint-title-row">
          <h2>{waypoint.title}</h2>

          <span
            className={`panel-status panel-status--${waypoint.status}`}
          >
            {waypoint.status.replace("-", " ")}
          </span>
        </div>

        <p className="waypoint-description">
          {waypoint.description}
        </p>

        <div className="waypoint-progress-box">
          <div className="waypoint-progress-head">
            <span>Overall Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="waypoint-progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="waypoint-metrics">
            <div>
              <Clock3 size={18} />
              <span>Estimated Time</span>
              <strong>{estimatedTime}</strong>
            </div>

            <div>
              <CalendarDays size={18} />
              <span>Skills to Master</span>
              <strong>{skills.length} skills</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="waypoint-panel-card">
        <h3>Skills Checklist</h3>

        <div className="skills-checklist">
          {skills.map((skill, index) => {
            const isComplete = index < completedSkills;

            return (
              <div className="skill-check-row" key={skill}>
                {isComplete ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Circle size={18} />
                )}

                <span>{skill}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="waypoint-panel-card">
        <div className="panel-heading-row">
          <h3>Recommended Resources</h3>
          <button type="button">View all</button>
        </div>

        <div className="resource-list">
          <a href="/resources">
            <Database size={22} />
            <span>
              <strong>{waypoint.category} Starter Guide</strong>
              <small>Course • 3h 45m</small>
            </span>
            <ArrowRight size={18} />
          </a>

          <a href="/resources">
            <BookOpen size={22} />
            <span>
              <strong>{waypoint.title} Lessons</strong>
              <small>Practice • 15 lessons</small>
            </span>
            <ArrowRight size={18} />
          </a>

          <a href="/resources">
            <FileSpreadsheet size={22} />
            <span>
              <strong>Portfolio Worksheet</strong>
              <small>Template • 40m</small>
            </span>
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="waypoint-panel-card waypoint-insight-card">
        <div className="panel-heading-row panel-heading-row--left">
          <Sparkles size={18} />
          <h3>AI Coach Insight</h3>
        </div>

        <p>
          {waypoint.status === "completed"
            ? "Great work completing this stage. Review your notes before moving into the next waypoint."
            : waypoint.status === "locked"
              ? "This stage will unlock once the previous waypoint is complete. Keep your focus on the active step."
              : `Great progress. Focus on ${skills[2]} before moving deeper into ${waypoint.category.toLowerCase()}.`}
        </p>
      </section>

      <button type="button" className="waypoint-action-button">
        <BadgeCheck size={42} />
        <span>
          <small>Complete this waypoint to earn</small>
          <strong>{waypoint.category} Badge</strong>
        </span>

        <span className="waypoint-action-label">
          {waypoint.status === "completed"
            ? "Review"
            : waypoint.status === "in-progress"
              ? "Continue"
              : "View"}
        </span>

        <ArrowRight size={18} />
      </button>
    </aside>
  );
}

export default WaypointDetails;
