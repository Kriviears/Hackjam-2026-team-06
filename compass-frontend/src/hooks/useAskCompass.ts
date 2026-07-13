import { useEffect, useMemo, useState } from "react";

import { askCompass } from "../services/askCompassApi";
import type { JourneyProgressChart } from "../types/journeyProgress";
import type { JourneyResponse, UserProfile } from "../types/journey";

interface UseAskCompassParams {
  firstName: string;
  journey: JourneyResponse;
  journeyProgressChart: JourneyProgressChart;
  userProfile: UserProfile;
}

// Creates the initial Ask Compass greeting from the learner and destination.
function getAssistantGreeting(firstName: string, destination: string) {
  return `Hi ${firstName}! I've been keeping track of your journey toward becoming a ${destination}.\n\nI can help you decide what to work on next.`;
}

// Owns the Ask Compass animation, expansion state, backend request, and answer state.
export function useAskCompass({
  firstName,
  journey,
  journeyProgressChart,
  userProfile,
}: UseAskCompassParams) {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState("");

  const greeting = useMemo(
    () => getAssistantGreeting(firstName, journey.destination),
    [firstName, journey.destination],
  );

  useEffect(() => {
    // The assistant starts with typing bubbles, then switches to the greeting.
    const greetingTimer = window.setTimeout(() => {
      setReady(true);
    }, 2400);

    return () => window.clearTimeout(greetingTimer);
  }, []);

  useEffect(() => {
    // Once the greeting is ready, reveal it one character at a time.
    if (!ready) {
      setTypedLength(0);
      return;
    }

    setTypedLength(0);
    const typingTimer = window.setInterval(() => {
      setTypedLength((length) => {
        if (length >= greeting.length) {
          window.clearInterval(typingTimer);
          return length;
        }

        return length + 1;
      });
    }, 18);

    return () => window.clearInterval(typingTimer);
  }, [greeting, ready]);

  // Sends the selected suggested question plus journey context to the LLM route.
  const askQuestion = async (question: string) => {
    setExpanded(true);
    setAnswer("");
    setError("");
    setLoadingQuestion(question);

    try {
      const assistantAnswer = await askCompass({
        question,
        journey,
        userProfile,
        journeyProgressChart,
      });

      setAnswer(assistantAnswer);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ask Compass could not answer right now.",
      );
    } finally {
      setLoadingQuestion("");
    }
  };

  return {
    answer,
    askQuestion,
    error,
    expanded,
    greeting,
    loadingQuestion,
    ready,
    setExpanded,
    typedLength,
  };
}
