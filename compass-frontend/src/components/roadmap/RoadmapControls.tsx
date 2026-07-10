import {
  LocateFixed,
  MinusCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

function RoadmapControls() {
  return (
    <div className="roadmap-controls">
      <button type="button">
        <MinusCircle size={21} />
        <span>Zoom Out</span>
      </button>

      <button type="button">
        <PlusCircle size={21} />
        <span>Zoom In</span>
      </button>

      <button type="button">
        <LocateFixed size={21} />
        <span>Center</span>
      </button>

      <button type="button">
        <RefreshCw size={21} />
        <span>Recalculate Path</span>
      </button>
    </div>
  );
}

export default RoadmapControls;