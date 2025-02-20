import { forwardRef } from "react";
import classNames from "classnames";
import { Props } from "./types";
import s from "./Button.module.css";

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
      disabled = false,
      isLoading = false,
      variant = "primary",
      size = "md",
      type = "button",
      spinner,
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
        <span className={classNames(s.content, { [s.hidden]: isLoading })}>
          {children}
        </span>
        {isLoading && (
          <div className={s.spinnerOverlay}>
            <div className={s.spinner}>{spinner || <div />}</div>
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
