import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Home,
  Route,
  UserRound,
} from "lucide-react";
import compassLandingLogo from "../assets/compass-landing-logo.png";
import landscapeImage from "../assets/tech-landscape.png";
import "./LandingPage.css";

type Benefit = {
  icon: string;
  title: string;
  description: string;
};

type JourneyStep = {
  number: number;
  icon: ReactNode;
  title: string;
};

const benefits: Benefit[] = [
  {
    icon: "🧭",
    title: "Personalized Roadmaps",
    description: "AI creates a learning path unique to you.",
  },
  {
    icon: "📍",
    title: "Know Where You Stand",
    description: "Understand exactly what skills you already have.",
  },
  {
    icon: "🚀",
    title: "Reach Your Destination",
    description: "Track milestones until you meet your goals.",
  },
];

const journeySteps: JourneyStep[] = [
  {
    number: 1,
    icon: <UserRound size={45} />,
    title: "Tell us about yourself",
  },
  {
    number: 2,
    icon: <BrainCircuit size={45} />,
    title: "AI builds your roadmap",
  },
  {
    number: 3,
    icon: <Route size={45} />,
    title: "Follow your journey",
  },
  {
    number: 4,
    icon: <BriefcaseBusiness size={45} />,
    title: "Land your first tech role",
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
        <button type="button" onClick={() => navigate("/")}>
          <Home size={22} />
          <span>Home</span>
        </button>

        <button type="button" onClick={startJourney}>
          <span>Start My Journey</span>
          <ArrowRight size={24} />
        </button>
      </nav>

      <section className="landing-frame">
        <section className="landing-hero-panel" aria-labelledby="landing-title">
          <div className="hero-tech-lines hero-tech-lines-left" aria-hidden="true" />
          <div className="hero-tech-lines hero-tech-lines-right" aria-hidden="true" />

          <div className="compass-wrapper">
            <div className="compass-glow" aria-hidden="true" />
            <img
              className="compass-landing-image"
              src={compassLandingLogo}
              alt="Compass digital navigation logo"
            />
          </div>

          <div className="brand-heading">
            <span className="heading-line" />
            <h1 id="landing-title">COMPASS</h1>
            <span className="heading-line" />
          </div>

          <p className="brand-tagline">Find Your Direction in Tech</p>

          <div className="hero-divider" aria-hidden="true">
            <span />
            <div className="divider-node" />
            <span />
          </div>

          <div className="hero-message">
            <h2>Personalized AI Career Navigation</h2>
            <p>From where you are today...</p>
            <span className="direction-arrow" aria-hidden="true">
              ↓
            </span>
            <p>...to the tech career you want tomorrow.</p>
          </div>
        </section>

        <section className="landing-info-panel" aria-label="Compass details">
          <section className="landing-card benefits-section">
            <SectionHeading title="Why Compass?" />

            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <article className="benefit-card" key={benefit.title}>
                  <div className="benefit-icon-ring">
                    <span aria-hidden="true">{benefit.icon}</span>
                  </div>

                  <h3>{benefit.title}</h3>
                  <span className="small-accent-line" />
                  <p>{benefit.description}</p>

                  {index < benefits.length - 1 && (
                    <span className="benefit-divider" aria-hidden="true" />
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="landing-card process-section">
            <SectionHeading title="How It Works" />

            <div className="journey-steps">
              {journeySteps.map((step, index) => (
                <div className="step-group" key={step.number}>
                  <article className="journey-step">
                    <div className="step-icon-ring">
                      <span className="step-number">{step.number}</span>
                      <span className="step-icon" aria-hidden="true">
                        {step.icon}
                      </span>
                    </div>

                    <h3>{step.title}</h3>
                  </article>

                  {index < journeySteps.length - 1 && (
                    <div className="step-connector" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

type SectionHeadingProps = {
  title: string;
};

function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <span className="section-heading-line" />
      <h2>{title}</h2>
      <span className="section-heading-line" />
    </div>
  );
}

export default LandingPage;
