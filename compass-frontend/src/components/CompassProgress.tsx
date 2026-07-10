import {
  CircleCheck,
  Compass,
  Flag,
  Navigation,
  Route,
  Sparkles,
} from "lucide-react";

interface CompassProgressProps {
  destination: string;
  stage: string;
  progress: number;
  nextStep: string;
}

function CompassProgress({
  destination,
  stage,
  progress,
  nextStep,
}: CompassProgressProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <section className="compass-progress-section">
      <div className="compass-progress-visual">
        <div className="compass-outer-ring">
          <div className="compass-inner-ring">
            <span className="compass-direction compass-north">N</span>
            <span className="compass-direction compass-east">E</span>
            <span className="compass-direction compass-south">S</span>
            <span className="compass-direction compass-west">W</span>

            <Compass className="compass-main-icon" strokeWidth={1.25} />
          </div>
        </div>
      </div>

      <div className="roadmap-summary-grid">
        <article className="roadmap-summary-card">
          <div className="summary-icon">
            <Flag size={22} />
          </div>

          <div>
            <span className="summary-label">Career Destination</span>
            <h3>{destination}</h3>
          </div>
        </article>

        <article className="roadmap-summary-card">
          <div className="summary-icon">
            <Navigation size={22} />
          </div>

          <div>
            <span className="summary-label">Current Stage</span>
            <h3>{stage}</h3>
          </div>
        </article>

        <article className="roadmap-summary-card next-step-card">
          <div className="summary-icon">
            <Route size={22} />
          </div>

          <div>
            <span className="summary-label">Recommended Next Step</span>
            <h3>{nextStep}</h3>
          </div>
        </article>
      </div>

      <div className="roadmap-progress-container">
        <div className="roadmap-progress-heading">
          <div>
            <Sparkles size={18} />
            <span>Roadmap Progress</span>
          </div>

          <strong>{safeProgress}%</strong>
        </div>

        <div
          className="roadmap-progress-track"
          role="progressbar"
          aria-label="Roadmap progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeProgress}
        >
          <div
            className="roadmap-progress-fill"
            style={{ width: `${safeProgress}%` }}
          />
        </div>

        <div className="roadmap-progress-message">
          <CircleCheck size={17} />
          <span>Your personalized pathway is ready to explore.</span>
        </div>
      </div>
    </section>
  );
}

export default CompassProgress;