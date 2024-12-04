import { createContext } from "react";

export const viewportContext = createContext<{ width: number; height: number }>(
  {
    width: 0,
    height: 0,
  }
);
