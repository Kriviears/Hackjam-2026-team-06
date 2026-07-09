import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./OnboardingPage.css";

type OnboardingData = {
  userType: string;
  careerGoal: string;
  experienceLevel: string;
  weeklyTimeCommitment: string;
  currentSkills: string[];
  supportNeeds: string[];
};

function OnboardingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    userType: "",
    careerGoal: "",
    experienceLevel: "",
    weeklyTimeCommitment: "",
    currentSkills: [],
    supportNeeds: [],
  });

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name as keyof OnboardingData] as string[], value]
        : (prev[name as keyof OnboardingData] as string[]).filter(
            (item) => item !== value
          ),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/journey/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const roadmapData = await response.json();

      navigate("/dashboard", {
        state: { roadmap: roadmapData },
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating your roadmap.");
    }
  }

  return (
    <main className="onboarding-page">
      <section className="onboarding-card">
        <h1>Start Your Compass Journey</h1>
        <p>
          Tell us where you are, where you want to go, and Compass will generate
          your first career roadmap.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Who are you right now?
            <select name="userType" value={formData.userType} onChange={handleChange} required>
              <option value="">Select one</option>
              <option value="current_learner">Current Learner</option>
              <option value="career_changer">Career Changer</option>
              <option value="early_career">Early Career / Recent Graduate</option>
            </select>
          </label>

          <label>
            Career Goal
            <select name="careerGoal" value={formData.careerGoal} onChange={handleChange} required>
              <option value="">Select a goal</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="AI Solutions Developer">AI Solutions Developer</option>
              <option value="UX/UI Designer">UX/UI Designer</option>
            </select>
          </label>

          <label>
            Experience Level
            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="some_experience">Some Experience</option>
              <option value="intermediate">Intermediate</option>
            </select>
          </label>

          <label>
            Weekly Time Commitment
            <select
              name="weeklyTimeCommitment"
              value={formData.weeklyTimeCommitment}
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              <option value="0-5">0–5 hours</option>
              <option value="6-10">6–10 hours</option>
              <option value="11-15">11–15 hours</option>
              <option value="16+">16+ hours</option>
            </select>
          </label>

          <div className="form-group">
            <h3>Current Skills</h3>
            {["HTML", "CSS", "JavaScript", "React", "Node.js", "Python", "SQL", "Git/GitHub"].map((skill) => (
              <label className="checkbox-label" key={skill}>
                <input
                  type="checkbox"
                  name="currentSkills"
                  value={skill}
                  checked={formData.currentSkills.includes(skill)}
                  onChange={handleCheckboxChange}
                />
                {skill}
              </label>
            ))}
          </div>

          <div className="form-group">
            <h3>Support Needed</h3>
            {[
              "Skill building",
              "Project ideas",
              "Portfolio guidance",
              "Interview prep",
              "Job search strategy",
              "Confidence and accountability",
            ].map((support) => (
              <label className="checkbox-label" key={support}>
                <input
                  type="checkbox"
                  name="supportNeeds"
                  value={support}
                  checked={formData.supportNeeds.includes(support)}
                  onChange={handleCheckboxChange}
                />
                {support}
              </label>
            ))}
          </div>

          <button type="submit">Generate My Roadmap</button>
        </form>
      </section>
    </main>
  );
}

export default OnboardingPage;