import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import techLandscape from "../assets/tech-landscape.png";
import {
    BarChart3,
    BriefcaseBusiness,
    Check,
    ClipboardCheck,
    GraduationCap,
    ShieldCheck,
    Target,
    UserRound,
} from "lucide-react";


import type { JourneyRequest } from "../types/journey";
import "./OnboardingPage.css";

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

    const [formData, setFormData] = useState<JourneyRequest>({
        userType: "",
        careerGoal: "",
        experienceLevel: "",
        weeklyTimeCommitment: "",
        existingSkills: [],
        learningInterests: [],
        targetTimeline: "",
        biggestChallenge: "",
        additionalNotes: "",
    });
    const [validationMessage, setValidationMessage] = useState("");

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
        setValidationMessage("");
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
        setValidationMessage("");
    };

    const getMissingRequiredFields = () => {
        const requiredFields = [
            { label: "which best describes you", value: formData.userType },
            { label: "your experience level", value: formData.experienceLevel },
            { label: "your career goal", value: formData.careerGoal },
            {
                label: "your weekly time commitment",
                value: formData.weeklyTimeCommitment,
            },
            { label: "your target timeline", value: formData.targetTimeline },
            { label: "your biggest challenge", value: formData.biggestChallenge },
        ];

        return requiredFields
            .filter((field) => !field.value.trim())
            .map((field) => field.label);
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const missingFields = getMissingRequiredFields();

        if (missingFields.length > 0) {
            setValidationMessage(
                `Please complete ${missingFields.join(", ")} before navigating your path.`
            );
            return;
        }

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
            <div className="onboarding-layout">
                <aside className="onboarding-intro" aria-label="Onboarding introduction">
                    <div className="intro-content">
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

                    {/* <img
                        className="onboarding-intro-logo"
                        src={compassLogo}
                        alt=""
                        aria-hidden="true"
                    /> */}

                    <blockquote className="intro-quote">
                        <span className="quote-mark">&ldquo;</span>

                        <p>The best way to predict the future is to create it.</p>

                        <cite>— Peter Drucker</cite>
                    </blockquote>
                </aside>

                <section className="onboarding-card">
                    <nav className="step-sidebar" aria-label="Onboarding progress">
                        <StepItem
                            number={1}
                            title="Tell Us About Yourself"
                            icon={<UserRound size={25} />}
                            active
                        />

                        <StepItem
                            number={2}
                            title="Your Goals & Interests"
                            icon={<Target size={24} />}
                        />

                        <StepItem
                            number={3}
                            title="Your Experience & Skills"
                            icon={<BarChart3 size={24} />}
                        />

                        <StepItem
                            number={4}
                            title="Review & Generate"
                            icon={<ClipboardCheck size={24} />}
                        />

                        <div className="privacy-note">
                            <span className="privacy-icon">
                                <ShieldCheck size={26} />
                            </span>
                            <p>Your information is secure and private.</p>
                        </div>
                    </nav>

                    <form className="onboarding-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-heading-row">
                            <div>
                                <div className="form-title">
                                    <span className="section-number">1</span>

                                    <div>
                                        <h2>Tell Us About Yourself</h2>
                                        <p>This helps us understand where you are today.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="top-progress">
                                <span>Step 1 of 4</span>

                                <div className="progress-track">
                                    <span className="progress-fill" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                    <span className="progress-point completed" />
                                </div>
                            </div>
                        </div>

                        {validationMessage && (
                            <div className="validation-popup" role="alert">
                                <div>
                                    <strong>Almost there</strong>
                                    <p>{validationMessage}</p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Dismiss validation message"
                                    onClick={() => setValidationMessage("")}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div className="form-grid">
                            <FormField htmlFor="userType" fullWidth>
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
                                                    className={`user-type-card ${selected ? "selected" : ""
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
                                                        <Icon size={34} />

                                                        {selected && (
                                                            <span className="checkmark">
                                                                <Check size={15} />
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
                                fullWidth
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

                            <FormField
                                label="What is your ultimate career goal?"
                                htmlFor="careerGoal"
                                fullWidth
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

                            <FormField
                                label="How much time can you commit to learning each week?"
                                htmlFor="weeklyTimeCommitment"
                                fullWidth
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
                                fullWidth
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
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="continue-button">
                                Navigate My Path
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </form>
                </section>
            </div>

            <footer className="onboarding-footer">
                <div className="footer-brand">
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
    icon: ReactNode;
    active?: boolean;
};

function StepItem({ number, title, icon, active = false }: StepItemProps) {
    return (
        <div className={`step-item ${active ? "active" : ""}`}>
            <div className="step-marker">
                <span>{number}</span>
            </div>

            <span className="onboarding-step-icon" aria-hidden="true">
                {icon}
            </span>

            <p>{title}</p>
        </div>
    );
}

type FormFieldProps = {
    label?: string;
    htmlFor: string;
    optional?: boolean;
    fullWidth?: boolean;
    children: ReactNode;
};

function FormField({
    label,
    htmlFor,
    optional = false,
    fullWidth = false,
    children,
}: FormFieldProps) {
    return (
        <div className={`form-field ${fullWidth ? "full-width" : ""}`}>
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
