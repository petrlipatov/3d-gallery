import { InputHTMLAttributes, MutableRefObject, ReactNode } from "react";
import s from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRender?: (id?: string) => ReactNode;
  className?: string;
  ref?: MutableRefObject<HTMLInputElement>;
}

export function Input({
  label,
  labelRender,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className={`${s.inputContainer} ${className}`}>
      {labelRender
        ? labelRender(id)
        : label && (
            <label htmlFor={id} className={s.label}>
              {label}
            </label>
          )}
      <input id={id} className={s.input} {...props} />
    </div>
  );
}
