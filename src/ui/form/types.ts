import { ReactNode, FormHTMLAttributes } from "react";

export type Props = FormHTMLAttributes<HTMLFormElement> & {
  children?: ReactNode;
};
