import {
  LocateFixed,
  MinusCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

function RoadmapControls() {
  return (
    <div className="roadmap-controls">
      <button type="button" aria-label="Zoom out" title="Zoom out">
        <MinusCircle size={21} />
      </button>

      <button type="button" aria-label="Zoom in" title="Zoom in">
        <PlusCircle size={21} />
      </button>

      <button type="button" aria-label="Center roadmap" title="Center roadmap">
        <LocateFixed size={21} />
      </button>

      <button
        type="button"
        aria-label="Recalculate path"
        title="Recalculate path"
      >
        <RefreshCw size={21} />
      </button>
    </div>
  );
}

export default RoadmapControls;
