import type { ReactNode } from "react";

export interface StepItemProps {
  number: number;
  title: string;
  icon: ReactNode;
  active?: boolean;
  completed?: boolean;
}

export interface FormFieldProps {
  label?: string;
  htmlFor: string;
  optional?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export interface CheckboxGroupProps {
  title: string;
  helperText: string;
  className?: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}
