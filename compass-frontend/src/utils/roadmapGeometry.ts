import type { RoadmapWaypoint } from "../types/roadmap";
import type { Point, RoadmapLandingPosition } from "../types/roadmapPage";

const startLandingPosition: RoadmapLandingPosition = {
  leftPercent: 33,
  bottomPercent: 7,
  roadProgressPercent: 0,
};

const roadSegments: Array<[Point, Point, Point, Point]> = [
  [
    { x: 295, y: 910 },
    { x: 250, y: 850 },
    { x: 260, y: 770 },
    { x: 385, y: 720 },
  ],
  [
    { x: 385, y: 720 },
    { x: 560, y: 642 },
    { x: 590, y: 545 },
    { x: 430, y: 475 },
  ],
  [
    { x: 430, y: 475 },
    { x: 270, y: 405 },
    { x: 300, y: 300 },
    { x: 495, y: 248 },
  ],
  [
    { x: 495, y: 248 },
    { x: 650, y: 206 },
    { x: 710, y: 126 },
    { x: 635, y: 40 },
  ],
];

// Samples a point along a cubic Bezier road segment.
function getCubicPoint(
  [start, controlA, controlB, end]: [Point, Point, Point, Point],
  t: number,
) {
  const inverse = 1 - t;

  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * controlA.x +
      3 * inverse * t ** 2 * controlB.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * controlA.y +
      3 * inverse * t ** 2 * controlB.y +
      t ** 3 * end.y,
  };
}

// Creates a dense list of road coordinates used for marker/avatar placement.
function getRoadSamples() {
  const samples: Array<Point & { length: number }> = [];
  let previous = roadSegments[0][0];
  let length = 0;

  samples.push({ ...previous, length });

  roadSegments.forEach((segment) => {
    for (let step = 1; step <= 32; step += 1) {
      const point = getCubicPoint(segment, step / 32);
      length += Math.hypot(point.x - previous.x, point.y - previous.y);
      samples.push({ ...point, length });
      previous = point;
    }
  });

  return samples;
}

const roadSamples = getRoadSamples();
const roadLength = roadSamples[roadSamples.length - 1].length;

// Finds the sampled road coordinate at a normalized progress value.
function getPointAtRoadProgress(progress: number) {
  const targetLength = roadLength * progress;
  const nextIndex = roadSamples.findIndex((sample) => sample.length >= targetLength);

  if (nextIndex <= 0) {
    return roadSamples[0];
  }

  const next = roadSamples[nextIndex];
  const previous = roadSamples[nextIndex - 1];
  const segmentLength = next.length - previous.length || 1;
  const localProgress = (targetLength - previous.length) / segmentLength;

  return {
    x: previous.x + (next.x - previous.x) * localProgress,
    y: previous.y + (next.y - previous.y) * localProgress,
  };
}

// Places each waypoint along the visible road curve.
export function getWaypointPosition(index: number, total: number) {
  const startProgress = 0.18;
  const endProgress = 0.92;
  const progress =
    total <= 1
      ? 0.58
      : startProgress + ((endProgress - startProgress) * index) / (total - 1);
  const point = getPointAtRoadProgress(progress);
  const leftPercent = (point.x / 800) * 100;
  const bottomPercent = ((1000 - point.y) / 1000) * 100 + 1.75;

  return {
    left: `${leftPercent}%`,
    bottom: `${bottomPercent}%`,
    leftPercent,
    bottomPercent,
    roadProgressPercent: progress * 100,
  };
}

// Blends between two landing positions for smooth avatar movement.
function interpolateLandingPosition(
  from: RoadmapLandingPosition,
  to: RoadmapLandingPosition,
  progress: number,
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    leftPercent:
      from.leftPercent + (to.leftPercent - from.leftPercent) * clampedProgress,
    bottomPercent:
      from.bottomPercent + (to.bottomPercent - from.bottomPercent) * clampedProgress,
    roadProgressPercent:
      from.roadProgressPercent +
      (to.roadProgressPercent - from.roadProgressPercent) * clampedProgress,
  };
}

// Converts a road progress percentage into a page-positioned landing point.
function getRoadLandingAtProgress(roadProgressPercent: number) {
  const clampedRoadProgress = Math.max(0, Math.min(100, roadProgressPercent));
  const point = getPointAtRoadProgress(clampedRoadProgress / 100);
  const leftPercent = (point.x / 800) * 100;
  const bottomPercent = ((1000 - point.y) / 1000) * 100 + 1.75;

  return {
    leftPercent,
    bottomPercent,
    roadProgressPercent: clampedRoadProgress,
  };
}

// Chooses straight or curved interpolation depending on the movement segment.
function getSegmentLandingPosition(
  from: RoadmapLandingPosition,
  to: RoadmapLandingPosition,
  progress: number,
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  /*
   * The first movement starts from the banner, which is intentionally off-road.
   * Every later movement follows the sampled road curve between marker landings.
   */
  if (from.roadProgressPercent === 0) {
    return interpolateLandingPosition(from, to, clampedProgress);
  }

  return getRoadLandingAtProgress(
    from.roadProgressPercent +
      (to.roadProgressPercent - from.roadProgressPercent) * clampedProgress,
  );
}

// Calculates where the traveler avatar should sit based on task completion.
export function getAvatarPosition(waypoints: RoadmapWaypoint[]) {
  let previousLanding = startLandingPosition;

  for (const waypoint of waypoints) {
    if (waypoint.status === "locked") {
      break;
    }

    const completedTasks = waypoint.tasks.filter((task) => task.completed).length;
    const waypointProgress =
      waypoint.tasks.length > 0 ? completedTasks / waypoint.tasks.length : 0;
    const waypointLanding = waypoint.position;

    if (waypointProgress < 1) {
      const landing = getSegmentLandingPosition(
        previousLanding,
        waypointLanding,
        waypointProgress,
      );

      return {
        left: `${landing.leftPercent}%`,
        bottom: `calc(${landing.bottomPercent}% + 8.2rem)`,
        roadProgressPercent: landing.roadProgressPercent,
      };
    }

    previousLanding = waypointLanding;
  }

  return {
    left: `${previousLanding.leftPercent}%`,
    bottom: `calc(${previousLanding.bottomPercent}% + 8.2rem)`,
    roadProgressPercent: previousLanding.roadProgressPercent,
  };
}
