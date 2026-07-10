import { useLocation, useNavigate } from "react-router-dom";
import type { JourneyRequest } from "../types/journey";

interface GeneratingLocationState {
  formData?: JourneyRequest;
}

export default function GeneratingPathwayPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData } =
    (location.state as GeneratingLocationState | null) ?? {};

  return (
    <main>
      <h1>Generating Your Pathway</h1>

      <p>
        Career goal:{" "}
        <strong>{formData?.careerGoal ?? "Not provided"}</strong>
      </p>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        Continue to Dashboard
      </button>
    </main>
  );
}