import {
  LocateFixed,
  MinusCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

interface RoadmapControlsProps {
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCenter: () => void;
  onRecalculate: () => void;
}

function RoadmapControls({
  onZoomOut,
  onZoomIn,
  onCenter,
  onRecalculate,
}: RoadmapControlsProps) {
  return (
    <div className="roadmap-controls">
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out"
        onClick={onZoomOut}
      >
        <MinusCircle size={21} />
      </button>

      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in"
        onClick={onZoomIn}
      >
        <PlusCircle size={21} />
      </button>

      <button
        type="button"
        aria-label="Center roadmap"
        title="Center roadmap"
        onClick={onCenter}
      >
        <LocateFixed size={21} />
      </button>

      <button
        type="button"
        aria-label="Recalculate path"
        title="Recalculate path"
        onClick={onRecalculate}
      >
        <RefreshCw size={21} />
      </button>
    </div>
  );
}

export default RoadmapControls;
