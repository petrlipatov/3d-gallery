import React, { forwardRef } from "react";
import classNames from "classnames";
import s from "./Button.module.css";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  spinner?: React.ReactElement;
  spinnerPlacement?: "start" | "end";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled = false,
      isLoading = false,
      variant = "primary",
      size = "md",
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={classNames(
          s.button,
          s[variant],
          s[size],
          {
            [s.loading]: isLoading,
            [s.disabled]: isDisabled,
          },
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <div className={s.spinnerOverlay}>
            <div className={s.spinner} />
          </div>
        ) : (
          <span className={s.content}>{children}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
