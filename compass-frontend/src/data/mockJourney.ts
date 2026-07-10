// src/data/mockJourney.ts

import type { JourneyResponse } from "../types/journey";

export const mockJourneyResponse: JourneyResponse = {
  id: "mock-data-analyst-journey",
  destination: "Data Analyst",
  currentStage: "Get Your Bearings",
  progressPercent: 0,
  nextStep: "Complete your first SQL fundamentals lesson",

  waypoints: [
    {
      title: "Get Your Bearings",
      description:
        "Review your current skills, available time, and career goals.",
      category: "Orientation",
      status: "in-progress",
    },
    {
      title: "Build Core Skills",
      description:
        "Develop foundational skills in SQL, Excel, Python, and data storytelling.",
      category: "Technical Skills",
      status: "pending",
    },
    {
      title: "Build Real-World Projects",
      description:
        "Apply your growing skills through portfolio projects and practical exercises.",
      category: "Portfolio",
      status: "pending",
    },
    {
      title: "Gain Practical Experience",
      description:
        "Build experience through internships, volunteer work, freelance projects, or collaboration.",
      category: "Experience",
      status: "pending",
    },
    {
      title: "Prepare for Your Career",
      description:
        "Strengthen your résumé, portfolio, interview skills, and professional presence.",
      category: "Career Preparation",
      status: "pending",
    },
    {
      title: "Launch and Continue Growing",
      description:
        "Begin applying for roles while continuing to develop your technical skills.",
      category: "Career Launch",
      status: "pending",
    },
  ],
};
