import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Database,
  FileText,
  GraduationCap,
  PlaySquare,
  Sparkles,
} from "lucide-react";
import type {
  LearningResource,
  RoadmapData,
  RoadmapWaypoint,
} from "../../types/roadmap";

interface WaypointDetailsProps {
  roadmap: RoadmapData;
  waypoint: RoadmapWaypoint;
  totalWaypoints: number;
  highlightedWaypointId: number | null;
  highlightTone: "current" | "preview" | "locked" | null;
  onToggleTask: (waypointId: number, taskIndex: number) => void;
}

const resourceTypeLabels: Record<LearningResource["type"], string> = {
  book: "Book",
  video: "Video",
  course: "Course",
  documentation: "Docs",
  worksheet: "Worksheet",
  website: "Website",
};

function getResourceIcon(type: LearningResource["type"]) {
  switch (type) {
    case "book":
    case "documentation":
      return BookOpen;
    case "course":
      return GraduationCap;
    case "video":
      return PlaySquare;
    case "worksheet":
      return FileText;
    case "website":
    default:
      return Database;
  }
}

function WaypointDetails({
  roadmap,
  waypoint,
  totalWaypoints,
  highlightedWaypointId,
  highlightTone,
  onToggleTask,
}: WaypointDetailsProps) {
  const [showAllResources, setShowAllResources] = useState(false);
  const completedWaypoints = roadmap.waypoints.filter(
    (roadmapWaypoint) => roadmapWaypoint.status === "completed",
  ).length;
  const journeyProgressPercent = roadmap.progressPercent;
  const tasks = waypoint.tasks;
  const resources = roadmap.resources ?? [];
  const recommendedResources = showAllResources
    ? resources
    : resources.slice(0, 3);
  const hasMoreResources = resources.length > 3;
  const resourcePreviewLabel = `${recommendedResources.length} of ${resources.length}`;
  const isLocked = waypoint.status === "locked";
  const visibleTasks = isLocked
    ? tasks.map((task) => ({
        ...task,
        completed: false,
      }))
    : tasks;
  const completedTasks = visibleTasks.filter((task) => task.completed).length;
  const progress =
    isLocked
      ? 0
      : tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;
  const estimatedTime =
    waypoint.status === "completed"
      ? "Complete"
      : waypoint.status === "locked"
        ? "Locked"
        : "4 weeks";
  const isHighlighted = waypoint.id === highlightedWaypointId;
  const panelHighlightClass =
    isHighlighted && highlightTone
      ? `waypoint-panel--highlight-${highlightTone}`
      : "";

  return (
    <aside
      className={`waypoint-panel ${
        isHighlighted ? "waypoint-panel--highlighted" : ""
      } ${panelHighlightClass}`}
    >
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
              <span>Tasks to Complete</span>
              <strong>{tasks.length} tasks</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="waypoint-panel-card">
        <h3>Waypoint Checklist</h3>

        <div className="skills-checklist">
          {visibleTasks.map((task, taskIndex) => {
            return (
              <label
                className={`skill-check-row ${
                  isLocked ? "skill-check-row--disabled" : ""
                }`}
                key={`${task.title}-${taskIndex}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled={isLocked}
                  onChange={() => onToggleTask(waypoint.id, taskIndex)}
                />
                <span className="skill-toggle" aria-hidden="true">
                  {task.completed ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </span>
                <span>{task.title}</span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="waypoint-panel-card">
        <div className="panel-heading-row">
          <h3>Recommended Resources</h3>
          <div className="panel-heading-actions">
            <span>{resourcePreviewLabel}</span>
            {hasMoreResources ? (
              <button
                type="button"
                onClick={() => setShowAllResources((isShowingAll) => !isShowingAll)}
              >
                {showAllResources ? "Show less" : "View all"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="resource-list">
          {recommendedResources.length > 0 ? recommendedResources.map((resource, resourceIndex) => {
            const ResourceIcon = getResourceIcon(resource.type);
            const resourceHref = resource.url ?? "#";
            const opensExternalResource = Boolean(resource.url);

            return (
              <a
                href={resourceHref}
                key={`${resource.title}-${resourceIndex}`}
                target={opensExternalResource ? "_blank" : undefined}
                rel={opensExternalResource ? "noreferrer" : undefined}
                title={`${resource.title}: ${resource.reason}`}
                aria-label={`Open ${resource.title}. ${resource.reason}`}
              >
                <ResourceIcon size={22} />
                <span>
                  <strong>{resource.title}</strong>
                  <small>
                    {resourceTypeLabels[resource.type]} • {resource.reason}
                  </small>
                </span>
                <ArrowRight size={18} />
              </a>
            );
          }) : (
            <p className="resource-empty-message">
              Generate or refresh your roadmap to view recommended resources.
            </p>
          )}
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
              ? "This stage is locked until you choose to inspect it. Click its roadmap card to view the details here."
              : `Great progress. Focus on ${visibleTasks.find((task) => !task.completed)?.title ?? waypoint.title} before moving deeper into ${waypoint.category.toLowerCase()}.`}
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
