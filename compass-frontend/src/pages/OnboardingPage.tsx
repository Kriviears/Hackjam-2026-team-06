import { useState, type ChangeEvent, type CSSProperties, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import techLandscape from "../assets/tech-landscape.png";
import compassLogo from "../assets/compass-logo.png";
import "./OnboardingPage.css";

import {
    UserRound,
    GraduationCap,
    BriefcaseBusiness,
    Check,
} from "lucide-react";

type OnboardingFormData = {
    userType: string;
    experienceLevel: string;
    careerGoal: string;
    weeklyTimeCommitment: string;
    existingSkills: string[];
    learningInterests: string[];
    targetTimeline: string;
    biggestChallenge: string;
    additionalNotes: string;
};

const skillOptions = [
    "HTML",
    "CSS",
    "JavaScript",
    "Python",
    "SQL",
    "React",
    "Node.js",
    "Git",
    "AWS",
];

const interestOptions = [
    "Web Development",
    "Data Science",
    "AI / Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "Mobile Development",
];

function OnboardingPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<OnboardingFormData>({
        userType: "",
        experienceLevel: "",
        careerGoal: "",
        weeklyTimeCommitment: "",
        existingSkills: [],
        learningInterests: [],
        targetTimeline: "",
        biggestChallenge: "",
        additionalNotes: "",
    });

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (
        field: "existingSkills" | "learningInterests",
        value: string
    ) => {
        setFormData((previousData) => {
            const selectedValues = previousData[field];

            const updatedValues = selectedValues.includes(value)
                ? selectedValues.filter((item) => item !== value)
                : [...selectedValues, value];

            return {
                ...previousData,
                [field]: updatedValues,
            };
        });
    };
    
const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Onboarding form data:", formData);

    navigate("/generating-path", {
        state: {
            formData,
        },
    });
};

    return (
        <main
            className="onboarding-page"
            style={{
                backgroundImage: `linear-gradient(
          90deg,
          rgba(236, 248, 255, 0.3),
          rgba(236, 248, 255, 0.65)
        ), url(${techLandscape})`,
            }}
        >
            <header className="onboarding-header">
                <div className="brand">
                    <img
                        className="brand-logo"
                        src={compassLogo}
                        alt="Compass logo"
                    />

                    <span className="brand-name">COMPASS</span>
                </div>
            </header>

            <div className="onboarding-layout">
                <aside
                    className="onboarding-intro"
                    style={{ "--intro-cityscape": `url(${techLandscape})` } as CSSProperties}
                >
                    <div className="intro-content">
                        <p className="intro-eyebrow">Personalized AI Career Navigation</p>

                        <h1>
                            Let&apos;s Build
                            <span>Your Path</span>
                        </h1>

                        <div className="intro-line" />

                        <p className="intro-description">
                            Answer a few questions so our AI can create a personalized
                            roadmap tailored to your goals, skills, and lifestyle.
                        </p>
                    </div>

                    <div className="compass-illustration">
                        <div className="compass-ring compass-ring-large" />
                        <div className="compass-ring compass-ring-small" />

                        <IntroCompassSvg />
                    </div>

                </aside>

                <section className="onboarding-card">
                    <nav className="step-sidebar" aria-label="Onboarding progress">
                        <StepItem
                            number={1}
                            title="About You"
                            active
                        />

                        <StepItem
                            number={2}
                            title="Career Direction"
                            active
                        />

                        <StepItem
                            number={3}
                            title="Skills & Interests"
                            active
                        />

                        <StepItem
                            number={4}
                            title="Pace & Support"
                            active
                        />

                        <div className="privacy-note">
                            <span className="privacy-icon">♢</span>
                            <p>Your information is secure and private.</p>
                        </div>

                        <blockquote className="intro-quote rail-quote">
                            <span className="quote-mark">&ldquo;</span>

                            <p>The best way to predict the future is to create it.</p>

                            <cite>— Peter Drucker</cite>
                        </blockquote>
                    </nav>

                    <form className="onboarding-form" onSubmit={handleSubmit}>
                        <div className="form-heading-row">
                            <div>
                                <div className="form-title">
                                    <span className="section-number">✦</span>

                                    <div>
                                        <h2>Build Your Roadmap Profile</h2>
                                        <p>Share the context Compass needs to personalize your path.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="top-progress">
                                <span>Single-page setup</span>

                                <div className="progress-track">
                                    <span className="progress-fill" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <section className="form-section full-width">
                                <SectionHeader number={1} title="About You" />

                                <FormField htmlFor="userType">
                                    <fieldset className="form-group user-type-fieldset">
                                        <legend className="section-label">
                                            Which best describes you?
                                        </legend>

                                        <div className="user-type-grid">
                                            {[
                                                {
                                                    value: "prospectiveLearner",
                                                    label: "Prospective Learner",
                                                    icon: UserRound,
                                                },
                                                {
                                                    value: "currentLearner",
                                                    label: "Current Learner",
                                                    icon: GraduationCap,
                                                },
                                                {
                                                    value: "alumna",
                                                    label: "Alumna",
                                                    icon: BriefcaseBusiness,
                                                },
                                            ].map((option) => {
                                                const Icon = option.icon;
                                                const selected =
                                                    formData.userType === option.value;

                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`user-type-card ${
                                                            selected ? "selected" : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="userType"
                                                            value={option.value}
                                                            checked={selected}
                                                            onChange={handleChange}
                                                            required
                                                        />

                                                        <span className="user-type-icon-wrap">
                                                            <Icon size={40} />

                                                            {selected && (
                                                                <span className="checkmark">
                                                                    <Check size={16} />
                                                                </span>
                                                            )}
                                                        </span>

                                                        <span>{option.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                </FormField>

                                <FormField
                                    label="My experience level is..."
                                    htmlFor="experienceLevel"
                                >
                                    <select
                                        id="experienceLevel"
                                        name="experienceLevel"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select your experience level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="someExperience">Some experience</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </FormField>
                            </section>

                            <section className="form-section full-width">
                                <SectionHeader number={2} title="Career Direction" />

                                <FormField
                                    label="What is your ultimate career goal?"
                                    htmlFor="careerGoal"
                                >
                                    <input
                                        id="careerGoal"
                                        name="careerGoal"
                                        type="text"
                                        value={formData.careerGoal}
                                        onChange={handleChange}
                                        placeholder="e.g. Data Scientist, Full-Stack Developer, UX Designer"
                                        required
                                    />
                                </FormField>
                            </section>

                            <section className="form-section full-width">
                                <SectionHeader number={3} title="Skills & Interests" />

                                <CheckboxGroup
                                    title="What skills do you already have?"
                                    helperText="Select all that apply"
                                    options={skillOptions}
                                    selectedValues={formData.existingSkills}
                                    onToggle={(value) =>
                                        handleCheckboxChange("existingSkills", value)
                                    }
                                />

                                <CheckboxGroup
                                    title="What are you most interested in learning?"
                                    helperText="Select up to 3"
                                    options={interestOptions}
                                    selectedValues={formData.learningInterests}
                                    onToggle={(value) => {
                                        const isAlreadySelected =
                                            formData.learningInterests.includes(value);

                                        if (
                                            !isAlreadySelected &&
                                            formData.learningInterests.length >= 3
                                        ) {
                                            return;
                                        }

                                        handleCheckboxChange("learningInterests", value);
                                    }}
                                />
                            </section>

                            <section className="form-section full-width">
                                <SectionHeader number={4} title="Pace & Support" />

                                <div className="two-column-fields">
                                    <FormField
                                        label="How much time can you commit each week?"
                                        htmlFor="weeklyTimeCommitment"
                                    >
                                        <select
                                            id="weeklyTimeCommitment"
                                            name="weeklyTimeCommitment"
                                            value={formData.weeklyTimeCommitment}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select your time commitment</option>
                                            <option value="1-4 hours">1–4 hours</option>
                                            <option value="5-10 hours">5–10 hours</option>
                                            <option value="11-20 hours">11–20 hours</option>
                                            <option value="20+ hours">More than 20 hours</option>
                                        </select>
                                    </FormField>

                                    <FormField
                                        label="What is your target timeline?"
                                        htmlFor="targetTimeline"
                                    >
                                        <select
                                            id="targetTimeline"
                                            name="targetTimeline"
                                            value={formData.targetTimeline}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select your timeline</option>
                                            <option value="3 months">Within 3 months</option>
                                            <option value="6 months">Within 6 months</option>
                                            <option value="12 months">Within 12 months</option>
                                            <option value="flexible">My timeline is flexible</option>
                                        </select>
                                    </FormField>
                                </div>

                                <FormField
                                    label="What is your biggest challenge right now?"
                                    htmlFor="biggestChallenge"
                                >
                                    <select
                                        id="biggestChallenge"
                                        name="biggestChallenge"
                                        value={formData.biggestChallenge}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select your biggest challenge</option>
                                        <option value="knowingWhereToStart">
                                            Knowing where to start
                                        </option>
                                        <option value="choosingSkills">
                                            Choosing the right skills
                                        </option>
                                        <option value="stayingConsistent">
                                            Staying consistent
                                        </option>
                                        <option value="buildingExperience">
                                            Building real-world experience
                                        </option>
                                        <option value="findingOpportunities">
                                            Finding job opportunities
                                        </option>
                                    </select>
                                </FormField>

                                <FormField
                                    label="Anything else we should know?"
                                    optional
                                    htmlFor="additionalNotes"
                                >
                                    <textarea
                                        id="additionalNotes"
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleChange}
                                        placeholder="Share any additional context, goals, or circumstances that might help us personalize your path..."
                                        rows={4}
                                    />
                                </FormField>
                            </section>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="continue-button">
                                Save &amp; Continue
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <footer className="onboarding-footer">
                <div className="footer-brand">
                    <img src={compassLogo} alt="" />
                    <div>
                        <strong>COMPASS</strong>
                        <span>Find Your Direction in Tech</span>
                    </div>
                </div>

                <FooterFeature
                    icon="✦"
                    title="Personalized Roadmaps"
                    text="AI creates a path unique to you."
                />

                <FooterFeature
                    icon="⌖"
                    title="Know Where You Stand"
                    text="Understand your current skills."
                />

                <FooterFeature
                    icon="↗"
                    title="Reach Your Destination"
                    text="Track milestones to your goal."
                />
            </footer>
        </main>
    );
}

type StepItemProps = {
    number: number;
    title: string;
    active?: boolean;
};

function StepItem({ number, title, active = false }: StepItemProps) {
    return (
        <div className={`step-item ${active ? "active" : ""}`}>
            <div className="step-marker">
                <span>{number}</span>
            </div>

            <p>{title}</p>
        </div>
    );
}

type SectionHeaderProps = {
    number: number;
    title: string;
};

function SectionHeader({ number, title }: SectionHeaderProps) {
    return (
        <div className="inline-section-heading">
            <span>{number}</span>
            <h3>{title}</h3>
        </div>
    );
}

function IntroCompassSvg() {
    return (
        <svg
            className="intro-compass-svg"
            viewBox="0 0 220 220"
            aria-hidden="true"
        >
            <circle className="intro-compass-glow" cx="110" cy="110" r="92" />
            <circle className="intro-compass-outer" cx="110" cy="110" r="82" />
            <circle className="intro-compass-inner" cx="110" cy="110" r="56" />

            <path className="intro-compass-axis" d="M110 20v180M20 110h180" />
            <path className="intro-compass-star-long" d="M110 18l17 75 75 17-75 17-17 75-17-75-75-17 75-17z" />
            <path className="intro-compass-star-short" d="M60 60l43 31 7 19-19-7-31-43zM160 60l-31 43-19 7 7-19 43-31zM160 160l-43-31-7-19 19 7 31 43zM60 160l31-43 19-7-7 19-43 31z" />
            <circle className="intro-compass-hub-outer" cx="110" cy="110" r="12" />
            <circle className="intro-compass-hub-inner" cx="110" cy="110" r="5" />
        </svg>
    );
}

type FormFieldProps = {
    label?: string;
    htmlFor: string;
    optional?: boolean;
    children: React.ReactNode;
};

function FormField({
    label,
    htmlFor,
    optional = false,
    children,
}: FormFieldProps) {
    return (
        <div className="form-field">
            {label && (
                <label htmlFor={htmlFor}>
                    {label}
                    {optional && <span className="optional-label"> (Optional)</span>}
                </label>
            )}

            {children}
        </div>
    );
}

type CheckboxGroupProps = {
    title: string;
    helperText: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
};

function CheckboxGroup({
    title,
    helperText,
    options,
    selectedValues,
    onToggle,
}: CheckboxGroupProps) {
    return (
        <fieldset className="checkbox-section">
            <legend>{title}</legend>
            <p className="field-helper">{helperText}</p>

            <div className="checkbox-grid">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option);

                    return (
                        <label
                            key={option}
                            className={`checkbox-card ${isSelected ? "selected" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onToggle(option)}
                            />

                            <span className="custom-checkbox" />
                            <span>{option}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

type FooterFeatureProps = {
    icon: string;
    title: string;
    text: string;
};

function FooterFeature({ icon, title, text }: FooterFeatureProps) {
    return (
        <div className="footer-feature">
            <span className="footer-feature-icon">{icon}</span>

            <div>
                <strong>{title}</strong>
                <p>{text}</p>
            </div>
        </div>
    );
}

export default OnboardingPage;
