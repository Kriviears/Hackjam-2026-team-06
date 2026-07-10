import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowRight, Home } from "lucide-react";
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

// Array of benefits to display on the landing page
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

// Array of journey steps to illustrate the process
const journeySteps: JourneyStep[] = [
  {
    number: 1,
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="15" r="8" />
        <path d="M11 41c1.4-10.6 6-15.9 13-15.9S35.6 30.4 37 41H11z" />
      </svg>
    ),
    title: "Tell us about yourself",
  },
  {
    number: 2,
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M22 9c-2.7-4.8-10.5-3.2-10.5 3.4-5 .6-7.9 4-7.9 8.4 0 4 2.4 7.1 5.8 8.4-2.3 5.7 1.8 11.5 8.2 11.5 3.3 0 6-1.7 7.4-4.2V11.6c-.7-1.1-1.6-1.9-3-2.6z" />
        <path d="M26 9c2.7-4.8 10.5-3.2 10.5 3.4 5 .6 7.9 4 7.9 8.4 0 4-2.4 7.1-5.8 8.4 2.3 5.7-1.8 11.5-8.2 11.5-3.3 0-6-1.7-7.4-4.2V11.6c.7-1.1 1.6-1.9 3-2.6z" />
        <path d="M17 14c2.5.8 4 2.4 4.5 4.9M14 27c2.9.3 5.1 1.8 6.4 4.4M31 14c-2.5.8-4 2.4-4.5 4.9M34 27c-2.9.3-5.1 1.8-6.4 4.4" />
      </svg>
    ),
    title: "AI builds your roadmap",
  },
  {
    number: 3,
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 34h10c0-6.2 4.4-10.6 11-10.6h9" />
        <circle cx="13" cy="34" r="5.5" />
        <circle cx="36" cy="34" r="5.5" />
        <path d="M30 23V8h10l-2.8 4L40 16H30" />
      </svg>
    ),
    title: "Follow your journey",
  },
  {
    number: 4,
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="17" width="32" height="23" rx="4" />
        <path d="M18 17v-6h12v6M8 25h32M21 27h6" />
      </svg>
    ),
    title: "Land your first tech role",
  },
];

// Main landing page component
function LandingPage() {
  const navigate = useNavigate();

  const startJourney = () => {
    navigate("/onboarding");
  };

  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-background" aria-hidden="true">
          <img src={landscapeImage} alt="" />
        </div>

        <nav className="landing-top-nav" aria-label="Landing page navigation">
          <button type="button" onClick={() => navigate("/")}>
            <Home size={16} />
            <span>Home</span>
          </button>

          <button type="button" onClick={startJourney}>
            <span>Start My Journey</span>
            <ArrowRight size={16} />
          </button>
        </nav>

        <div className="hero-tech-lines hero-tech-lines-left" />
        <div className="hero-tech-lines hero-tech-lines-right" />

        <div className="hero-content">
          <div className="compass-wrapper">
            <div className="compass-glow" />
            <img
              className="compass-landing-image"
              src={compassLandingLogo}
              alt="Compass digital navigation logo"
            />
          </div>

          <div className="brand-heading">
            <span className="heading-line" />
            <h1>COMPASS</h1>
            <span className="heading-line" />
          </div>

          <p className="brand-tagline">Find Your Direction in Tech</p>

          <div className="hero-divider">
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
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-container">
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
        </div>
      </section>

      <section className="process-section">
        <div className="section-container">
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

                  <span className="step-arrow" aria-hidden="true">
                    ↓
                  </span>
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

          <section className="final-cta">
            <div className="cta-background" aria-hidden="true">
              <img src={landscapeImage} alt="" />
            </div>

            <div className="cta-content">
              <div className="mini-compass" aria-hidden="true">
                ✦
              </div>

              <h2>Ready to Begin?</h2>

              <span className="small-accent-line" />

              <button
                className="primary-cta-button"
                type="button"
                onClick={startJourney}
              >
                <span>Start My Journey</span>
                <span className="button-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </section>
        </div>
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
      <span className="section-heading-dot" />
      <h2>{title}</h2>
      <span className="section-heading-dot" />
      <span className="section-heading-line" />
    </div>
  );
}

function CompassLogo() {
  const tickAngles = Array.from({ length: 72 }, (_, index) => index * 5);

  return (
    <svg
      className="compass-logo-svg"
      viewBox="0 0 420 420"
      role="img"
      aria-label="Compass digital navigation logo"
    >
      <defs>
        <radialGradient id="compassFaceGradient" cx="50%" cy="45%" r="58%">
          <stop offset="0%" stopColor="#0d7e8b" />
          <stop offset="42%" stopColor="#063f50" />
          <stop offset="100%" stopColor="#021b29" />
        </radialGradient>
        <linearGradient id="metalRingGradient" x1="18%" x2="82%" y1="12%" y2="88%">
          <stop offset="0%" stopColor="#f9ffff" />
          <stop offset="18%" stopColor="#829aa3" />
          <stop offset="42%" stopColor="#f4ffff" />
          <stop offset="65%" stopColor="#314a55" />
          <stop offset="100%" stopColor="#d8edf2" />
        </linearGradient>
        <linearGradient id="tealNeedleGradient" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#d8feff" />
          <stop offset="46%" stopColor="#20d8e1" />
          <stop offset="100%" stopColor="#044e5c" />
        </linearGradient>
        <linearGradient id="goldNeedleGradient" x1="18%" x2="82%" y1="82%" y2="18%">
          <stop offset="0%" stopColor="#633a16" />
          <stop offset="35%" stopColor="#d99a36" />
          <stop offset="62%" stopColor="#fff5c6" />
          <stop offset="100%" stopColor="#b76b21" />
        </linearGradient>
        <filter id="compassSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.05 0 0 0 0 0.86 0 0 0 0 0.92 0 0 0 .78 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="needleShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#01141e" floodOpacity="0.5" />
        </filter>
      </defs>

      <g className="compass-hud">
        <circle cx="210" cy="210" r="196" />
        <circle cx="210" cy="210" r="176" />
        <circle cx="210" cy="210" r="154" />
        <path d="M210 14v58M210 348v58M14 210h58M348 210h58" />
        <path d="M86 86l32 32M302 302l32 32M334 86l-32 32M118 302l-32 32" />
      </g>

      <circle className="compass-outer-glow" cx="210" cy="210" r="168" />
      <circle cx="210" cy="210" r="146" fill="url(#metalRingGradient)" />
      <circle cx="210" cy="210" r="132" fill="#051f2e" />
      <circle cx="210" cy="210" r="120" fill="url(#compassFaceGradient)" />

      <g className="compass-ticks">
        {tickAngles.map((angle) => (
          <line
            key={angle}
            x1="210"
            y1={angle % 45 === 0 ? 89 : 96}
            x2="210"
            y2="104"
            transform={`rotate(${angle} 210 210)`}
          />
        ))}
      </g>

      <g className="compass-face-lines">
        <circle cx="210" cy="210" r="94" />
        <circle cx="210" cy="210" r="68" />
        <path d="M210 90v240M90 210h240M126 126l168 168M294 126L126 294" />
      </g>

      <g className="compass-star" filter="url(#compassSoftGlow)">
        <path className="star-long" d="M210 76l22 105 105 29-105 29-22 105-22-105-105-29 105-29z" />
        <path className="star-short" d="M138 138l62 43 10 29-29-10-43-62zM282 138l-43 62-29 10 10-29 62-43zM282 282l-62-43-10-29 29 10 43 62zM138 282l43-62 29-10-10 29-62 43z" />
      </g>

      <g className="compass-needle" filter="url(#needleShadow)">
        <path className="needle-teal" d="M122 304l78-94 86-72-66 94z" />
        <path className="needle-gold" d="M298 98l-66 124-110 82 78-106z" />
        <path className="needle-highlight" d="M298 98l-82 104-17-4z" />
      </g>

      <circle className="compass-hub-outer" cx="210" cy="210" r="22" />
      <circle className="compass-hub-inner" cx="210" cy="210" r="12" />

      <g className="compass-cardinals">
        <text x="210" y="82" textAnchor="middle">N</text>
        <text x="210" y="354" textAnchor="middle">S</text>
        <text x="76" y="224" textAnchor="middle">W</text>
        <text x="344" y="224" textAnchor="middle">E</text>
      </g>

      <g className="compass-bolts">
        <circle cx="210" cy="28" r="14" />
        <circle cx="210" cy="392" r="14" />
        <circle cx="28" cy="210" r="14" />
        <circle cx="392" cy="210" r="14" />
        <circle cx="210" cy="28" r="7" />
        <circle cx="210" cy="392" r="7" />
        <circle cx="28" cy="210" r="7" />
        <circle cx="392" cy="210" r="7" />
      </g>
    </svg>
  );
}

void CompassLogo;

export default LandingPage;
