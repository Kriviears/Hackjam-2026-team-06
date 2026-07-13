import type { ProgressRingProps } from "../../types/dashboardComponents";

function ProgressRing({ value, label, size = "lg", displayValue }: ProgressRingProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`dashboard-progress-ring dashboard-progress-ring--${size}`}
      style={{
        background: `conic-gradient(#d6aa2f ${clampedValue}%, #0d64d8 ${clampedValue}% 100%)`,
      }}
      aria-label={`${label ?? "Progress"} ${clampedValue}%`}
    >
      <span>
        <strong>{displayValue ?? `${clampedValue}%`}</strong>
        {label && <small>{label}</small>}
      </span>
    </div>
  );
}

export default ProgressRing;
