import { createContext } from "react";

export const viewportContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  }
);

type ImageData = {
  small: string;
  medium: string;
  large: string;
};

export const imagesContext = createContext<ImageData[] | null>(null);
