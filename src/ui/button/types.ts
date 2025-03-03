import { ButtonHTMLAttributes, ReactElement } from "react";

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  spinner?: ReactElement;
  spinnerPlacement?: "start" | "end";
};
