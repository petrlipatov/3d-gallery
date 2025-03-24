import { FC } from "react";
import { Props } from "./types";

export const ImageComponent: FC<Props> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  return <img src={src} alt={alt} className={className} {...props} />;
};
