import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JourneyRequest } from "../types/journey";
import { generateJourney } from "../services/journeyApi";

// OnboardingPage component that handles user input and journey generation
export default function OnboardingPage() {
    const navigate = useNavigate();

    // State to hold the form data for the journey request
    const [formData, setFormData] = useState<JourneyRequest>({
        userType: "",
        careerGoal: "",
        experienceLevel: "",
        weeklyTimeCommitment: ""
    });

    // Function to handle changes in the form inputs and update the state accordingly
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function to handle form submission, generate the journey, and navigate to the dashboard
    const handleSubmit = async () => {
        const journey = await generateJourney(formData);

        navigate("/dashboard", {
            state: { journey }
        });
    };
return (
    <main>
        <section>
            <p>Compass Career GPS</p>
            <h1>Build Your Personalized Path</h1>
            <p>Start by telling us where you are in the Per Scholas journey.</p>

            <label>
                Which best describes you?
                <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                >
                    <option value="">Select one</option>
                    <option value="prospect">Prospective Candidate</option>
                    <option value="currentLearner">Current Learner</option>
                    <option value="alumni">Alumni</option>
                </select>
            </label>

            <label>
                Career Goal
                <select
                    name="careerGoal"
                    value={formData.careerGoal}
                    onChange={handleChange}
                >
                    <option value="">Select one</option>
                    <option value="Gain entrance into Per Scholas">
                        Gain entrance into Per Scholas
                    </option>
                    <option value="Graduate successfully">
                        Graduate successfully
                    </option>
                    <option value="Gain employment">
                        Gain employment
                    </option>
                </select>
            </label>

            <label>
                Experience Level
                <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                >
                    <option value="">Select one</option>
                    <option value="beginner">Beginner</option>
                    <option value="some experience">Some experience</option>
                    <option value="comfortable">Comfortable</option>
                </select>
            </label>

            <label>
                Weekly Time Commitment
                <select
                    name="weeklyTimeCommitment"
                    value={formData.weeklyTimeCommitment}
                    onChange={handleChange}
                >
                    <option value="">Select one</option>
                    <option value="1-3 hours">1-3 hours</option>
                    <option value="4-6 hours">4-6 hours</option>
                    <option value="7-10 hours">7-10 hours</option>
                    <option value="10+ hours">10+ hours</option>
                </select>
            </label>

            <button onClick={handleSubmit}>
                Generate Journey
            </button>
        </section>
    </main>
);
}