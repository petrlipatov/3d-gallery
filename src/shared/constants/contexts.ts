import { createContext } from "react";
import { rootStore } from "../stores";
import { ImagesStore } from "../stores/images-store";

export const viewportContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  }
);

export const imagesContext = createContext<ImagesStore>(null);

export const storeContext = createContext<typeof rootStore>(null);
