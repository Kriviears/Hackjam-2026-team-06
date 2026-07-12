import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Home,
  Lock,
  Target,
  UsersRound,
} from "lucide-react";
import landscapeImage from "../assets/tech-landscape.png";
import "./LandingPage.css";

const previewSteps = [
  {
    title: "Understand your current profile",
    icon: Target,
    status: "complete",
  },
  {
    title: "Map your learning milestones",
    icon: UsersRound,
    status: "current",
  },
  {
    title: "Connect projects to careers",
    icon: Lock,
    status: "locked",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  const startJourney = () => {
    navigate("/onboarding");
  };

  return (
    <main className="landing-page">
      <div className="landing-background" aria-hidden="true">
        <img src={landscapeImage} alt="" />
      </div>

      <nav className="landing-top-nav" aria-label="Landing page navigation">
        <button type="button" className="landing-home-link" onClick={() => navigate("/")}>
          <Home size={16} />
          <span>Home</span>
        </button>
      </nav>

      <section className="landing-frame">
        <section className="landing-hero-panel" aria-labelledby="landing-title">
          <div className="landing-brand-lockup">
            <div>
              <h1 id="landing-title">COMPASS</h1>
            </div>
          </div>

          <p className="brand-tagline">Find Your Direction in Tech</p>

          <div className="hero-message">
            <h2>A personalized roadmap from where you are to the tech career you want.</h2>
            <p>
              AI-powered guidance tailored to your goals, experience, and the path you choose.
            </p>
          </div>

          <div className="landing-hero-actions">
            <button type="button" className="landing-primary-action" onClick={startJourney}>
              <span>Start My Journey</span>
              <ArrowRight size={22} />
            </button>

            <span className="landing-confidence">
              <UsersRound size={34} />
              <span>Built for Per Scholas learners, graduates, and future technologists.</span>
            </span>
          </div>
        </section>

        <section className="landing-preview-panel" aria-label="Compass roadmap preview">
          <div className="roadmap-preview-card">
            <div className="preview-card-header">
              <div>
                <p className="preview-kicker">Roadmap preview</p>
                <h2>A clear path, shaped around you</h2>
              </div>
            </div>

            <div className="preview-progress">
              <div>
                <span />
                <strong>33% Complete</strong>
              </div>

              <div className="preview-progress-track">
                <span />
              </div>
            </div>

            <div className="preview-timeline">
              {previewSteps.map((step) => (
                <article className="preview-step" key={step.title}>
                  <span className="preview-step-icon">
                    <step.icon size={20} />
                  </span>

                  <div>
                    <h3>{step.title}</h3>
                  </div>

                  <span className={`preview-step-status preview-step-status-${step.status}`}>
                    {step.status === "complete" && <Check size={16} />}
                  </span>
                </article>
              ))}
            </div>

            <div className="preview-footer">
              <Target size={22} />
              <strong>Compass adapts the roadmap as you grow.</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default LandingPage;
