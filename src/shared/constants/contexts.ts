import { createContext } from "react";
import { ImageData } from "../types";
import { authStore } from "../stores";

export const viewportContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  }
);

export const imagesContext = createContext<ImageData[] | null>(null);

export const authContext = createContext<typeof authStore>(null);
