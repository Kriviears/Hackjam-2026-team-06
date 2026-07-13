// Prop and helper types for roadmap-specific components.
import type { UserProfile } from "./journey";
import type {
  RoadmapData,
  RoadmapWaypoint as RoadmapWaypointType,
} from "./roadmap";

export type RoadmapHighlightTone = "current" | "preview" | "locked" | null;

export interface RoadmapPosition {
  left: string;
  bottom: string;
  roadProgressPercent: number;
}

export interface RoadmapCanvasProps {
  roadmap: RoadmapData;
  userProfile?: UserProfile;
  selectedWaypointId: number | null;
  highlightedWaypointId: number | null;
  highlightTone: RoadmapHighlightTone;
  travelerPosition: RoadmapPosition;
  onSelectWaypoint: (id: number | null) => void;
  onHoverWaypoint: (id: number | null) => void;
}

export interface RoadmapControlsProps {
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCenter: () => void;
  onRecalculate: () => void;
}

export interface RoadmapSidebarProps {
  roadmap: RoadmapData;
  userProfile?: UserProfile;
}

export interface RoadmapWaypointProps {
  waypoint: RoadmapWaypointType;
  highlightTone?: RoadmapHighlightTone;
  isFinal?: boolean;
  onSelect: () => void;
  onHoverChange?: (isHovered: boolean) => void;
  cardRef?: (element: HTMLButtonElement | null) => void;
}

export interface WaypointDetailsProps {
  roadmap: RoadmapData;
  waypoint: RoadmapWaypointType;
  totalWaypoints: number;
  highlightedWaypointId: number | null;
  highlightTone: RoadmapHighlightTone;
  onToggleTask: (waypointId: number, taskIndex: number) => void;
}
