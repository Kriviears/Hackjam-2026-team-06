import type {
  FutureYou,
  JourneyRequest,
  JourneyResponse,
  LearningResource,
  Waypoint,
} from "../types/journey";
import type {
  RawFutureYou,
  RawFutureYouCompany,
  RawFutureYouOpportunity,
  RawJourneyResponse,
  RawLearningResource,
  RawWaypoint,
  RawWaypointTask,
} from "../types/generatePathway";

// Normalizes unknown backend values into displayable text with a fallback.
function asText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

// Restricts backend resource types to the set the UI knows how to display.
function normalizeResourceType(type: unknown): LearningResource["type"] {
  if (
    type === "book" ||
    type === "video" ||
    type === "course" ||
    type === "documentation" ||
    type === "worksheet" ||
    type === "website"
  ) {
    return type;
  }

  return "website";
}

// Converts raw resource URLs into absolute external links when possible.
function normalizeResourceUrl(url: unknown) {
  if (typeof url !== "string" || !url.trim()) {
    return undefined;
  }

  const trimmedUrl = url.trim();

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  if (/^(www\.|[a-z0-9-]+(\.[a-z0-9-]+)+)(\/|$)/i.test(trimmedUrl)) {
    return `https://${trimmedUrl}`;
  }

  return undefined;
}

// Converts backend waypoint status values into the roadmap status model.
function normalizeWaypointStatus(
  status: unknown,
  index: number,
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

// Converts task completion values from booleans or string booleans.
function normalizeTaskCompletion(
  completed: unknown,
  waypointStatus: Waypoint["status"],
) {
  if (typeof completed === "boolean") {
    return completed;
  }

  if (typeof completed === "string") {
    return completed.toLowerCase() === "true";
  }

  return waypointStatus === "completed";
}

// Creates baseline tasks when the backend omits waypoint task detail.
function createFallbackTasks(
  waypointTitle: string,
  waypointStatus: Waypoint["status"],
) {
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

// Normalizes backend task arrays while ensuring each waypoint has usable tasks.
function normalizeWaypointTasks(
  rawTasks: unknown,
  waypointTitle: string,
  waypointStatus: Waypoint["status"],
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
      3,
    ),
  ];
}

// Normalizes generated waypoints and supplies a fallback path when needed.
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
        "Complete this milestone to keep moving toward your career goal.",
      ),
      category: asText(waypoint.category, fallbackCategory),
      status,
      tasks: normalizeWaypointTasks(waypoint.tasks, title, status),
    };
  });
}

// Provides reliable learning resources when generation returns too little data.
function createFallbackResources(formData: JourneyRequest): LearningResource[] {
  const careerGoal = formData.careerGoal || "your target career";

  return [
    {
      title: "Per Scholas Course Catalog",
      type: "website",
      url: "https://perscholas.org/courses/",
      reason: `Use this to compare current Per Scholas training options that align with ${careerGoal}.`,
    },
    {
      title: "Per Scholas Admissions",
      type: "website",
      url: "https://perscholas.org/apply/",
      reason:
        "This supports the immediate next step of checking eligibility, requirements, and application details.",
    },
    {
      title: "MDN Learn Web Development",
      type: "documentation",
      url: "https://developer.mozilla.org/en-US/docs/Learn",
      reason:
        "This provides beginner-friendly technical practice for learners building core web and software foundations.",
    },
  ];
}

// Normalizes resources and supplements missing entries with trusted defaults.
function normalizeResources(
  rawResources: unknown,
  formData: JourneyRequest,
): LearningResource[] {
  if (!Array.isArray(rawResources) || rawResources.length === 0) {
    return createFallbackResources(formData);
  }

  const normalizedResources = rawResources
    .slice(0, 5)
    .map((rawResource) => {
      const resource =
        rawResource && typeof rawResource === "object"
          ? (rawResource as RawLearningResource)
          : {};
      const title = asText(resource.title, "");
      const reason = asText(resource.reason, "");

      if (!title || !reason) {
        return null;
      }

      const normalizedResource: LearningResource = {
        title,
        type: normalizeResourceType(resource.type),
        reason,
      };

      const normalizedUrl = normalizeResourceUrl(resource.url);

      if (normalizedUrl) {
        normalizedResource.url = normalizedUrl;
      }

      return normalizedResource;
    })
    .filter((resource): resource is LearningResource => Boolean(resource));

  if (normalizedResources.length >= 3) {
    return normalizedResources;
  }

  return [
    ...normalizedResources,
    ...createFallbackResources(formData).slice(normalizedResources.length, 3),
  ];
}

// Safely extracts and limits string arrays from backend payloads.
function normalizeStringList(rawList: unknown, limit: number) {
  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((item) => asText(item, ""))
    .filter(Boolean)
    .slice(0, limit);
}

// Normalizes optional Future You guidance from the backend response.
function normalizeFutureYou(rawFutureYou: unknown): FutureYou | undefined {
  if (!rawFutureYou || typeof rawFutureYou !== "object" || Array.isArray(rawFutureYou)) {
    return undefined;
  }

  const futureYou = rawFutureYou as RawFutureYou;
  const title = asText(futureYou.title, "");
  const summary = asText(futureYou.summary, "");
  const nextOpportunity = asText(futureYou.nextOpportunity, "");

  if (!title || !summary || !nextOpportunity) {
    return undefined;
  }

  const roles = normalizeStringList(futureYou.roles, 3);
  const networkingActions = normalizeStringList(futureYou.networkingActions, 3);
  const companies = Array.isArray(futureYou.companies)
    ? futureYou.companies
        .map((rawCompany) => {
          const company =
            rawCompany && typeof rawCompany === "object"
              ? (rawCompany as RawFutureYouCompany)
              : {};
          const name = asText(company.name, "");
          const reason = asText(company.reason, "");

          return name && reason ? { name, reason } : null;
        })
        .filter((company): company is FutureYou["companies"][number] => Boolean(company))
        .slice(0, 3)
    : [];
  const opportunityTypes = Array.isArray(futureYou.opportunityTypes)
    ? futureYou.opportunityTypes
        .map((rawOpportunity) => {
          const opportunity =
            rawOpportunity && typeof rawOpportunity === "object"
              ? (rawOpportunity as RawFutureYouOpportunity)
              : {};
          const opportunityTitle = asText(opportunity.title, "");
          const reason = asText(opportunity.reason, "");

          return opportunityTitle && reason
            ? { title: opportunityTitle, reason }
            : null;
        })
        .filter(
          (opportunity): opportunity is FutureYou["opportunityTypes"][number] =>
            Boolean(opportunity),
        )
        .slice(0, 3)
    : [];

  if (
    roles.length === 0 ||
    companies.length === 0 ||
    opportunityTypes.length === 0 ||
    networkingActions.length === 0
  ) {
    return undefined;
  }

  return {
    title,
    summary,
    roles,
    companies,
    opportunityTypes,
    networkingActions,
    nextOpportunity,
  };
}

// Calculates starting roadmap progress from completed waypoint tasks.
function calculateJourneyProgress(waypoints: Waypoint[]) {
  const taskTotals = waypoints.reduce(
    (totals, waypoint) => {
      totals.total += waypoint.tasks.length;
      totals.completed += waypoint.tasks.filter((task) => task.completed).length;
      return totals;
    },
    { completed: 0, total: 0 },
  );

  if (taskTotals.total === 0) {
    return 0;
  }

  return Math.round((taskTotals.completed / taskTotals.total) * 100);
}

// Converts the raw backend roadmap into the JourneyResponse shape used by UI.
export function normalizeGeneratedRoadmap(
  rawRoadmap: RawJourneyResponse,
  formData: JourneyRequest,
): JourneyResponse {
  const waypoints = normalizeWaypoints(rawRoadmap.waypoints, formData);
  const resources = normalizeResources(rawRoadmap.resources, formData);
  const futureYou = normalizeFutureYou(rawRoadmap.futureYou);
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
    targetTimeline: formData.targetTimeline,
    waypoints,
    resources,
    futureYou,
  };
}
