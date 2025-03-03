import { InputHTMLAttributes, MutableRefObject, ReactNode } from "react";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRender?: (id?: string) => ReactNode;
  className?: string;
  ref?: MutableRefObject<HTMLInputElement>;
}
