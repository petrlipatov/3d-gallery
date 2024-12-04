import { useContext } from "react";
import { viewportContext } from "../constants";

export const useViewport = () => {
  const { width, height } = useContext(viewportContext);
  return { width, height };
};
