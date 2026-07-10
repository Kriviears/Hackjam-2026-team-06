// src/data/mockJourney.ts

import type { JourneyResponse } from "../types/journey";

export const mockJourneyResponse: JourneyResponse = {
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
      status: "current",
    },
    {
      title: "Build Core Skills",
      description:
        "Develop foundational skills in SQL, Excel, Python, and data storytelling.",
      category: "Technical Skills",
      status: "locked",
    },
    {
      title: "Build Real-World Projects",
      description:
        "Apply your growing skills through portfolio projects and practical exercises.",
      category: "Portfolio",
      status: "locked",
    },
    {
      title: "Gain Practical Experience",
      description:
        "Build experience through internships, volunteer work, freelance projects, or collaboration.",
      category: "Experience",
      status: "locked",
    },
    {
      title: "Prepare for Your Career",
      description:
        "Strengthen your résumé, portfolio, interview skills, and professional presence.",
      category: "Career Preparation",
      status: "locked",
    },
    {
      title: "Launch and Continue Growing",
      description:
        "Begin applying for roles while continuing to develop your technical skills.",
      category: "Career Launch",
      status: "locked",
    },
  ],
};