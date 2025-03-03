import { Props } from "./types";
import s from "./Input.module.css";

export function Input({
  label,
  labelRender,
  className = "",
  id,
  ...props
}: Props) {
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
