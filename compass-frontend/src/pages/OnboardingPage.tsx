import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JourneyRequest } from "../types/journey";
import { generateJourney } from "../services/journeyApi";

// OnboardingPage component that handles user input and journey generation
export default function OnboardingPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<JourneyRequest>({
        userType: "",
        careerGoal: "",
        experienceLevel: "",
        weeklyTimeCommitment: ""
    });

    const handleSubmit = async () => {
        const journey = await generateJourney(formData);

        navigate("/dashboard", {
            state: { journey }
        });
    };

    return (
        <div>
            {/* Your onboarding UI goes here */}
            <button onClick={handleSubmit}>
                Generate Journey
            </button>
        </div>
    );
}