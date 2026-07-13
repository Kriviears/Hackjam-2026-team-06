import type { ReactNode } from "react";

export interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export interface ProgressRingProps {
  value: number;
  label?: string;
  size?: "sm" | "lg";
  displayValue?: string;
}
