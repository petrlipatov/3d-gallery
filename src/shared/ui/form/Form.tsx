import { forwardRef } from "react";
import classNames from "classnames";
import { Props } from "./types";
import s from "./Form.module.css";

export const Form = forwardRef<HTMLFormElement, Props>(
  ({ children, className, ...rest }: Props, ref) => {
    return (
      <form className={classNames(s.form, className)} {...rest} ref={ref}>
        {children}
      </form>
    );
  }
);
