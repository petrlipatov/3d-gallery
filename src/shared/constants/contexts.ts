import { createContext } from "react";
import { rootStore } from "../stores";
import { ImageData } from "../models/ImageData";

export const viewportContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  }
);

export const imagesContext = createContext<ImageData[] | null>(null);

export const storeContext = createContext<typeof rootStore>(null);
