import { Dispatch } from "react";
import { Coordinates } from "@/shared/types";
import { Animations } from "@/shared/constants";

export type Props = {
  activeAnimation: Animations;
  randomCoordinates: Coordinates;
  isAnimating: boolean;
  isDragged: boolean;
  imageClickHandler: (index: number) => void;
  setIsControlsEnabled: Dispatch<React.SetStateAction<boolean>>;
  setIsDragged: Dispatch<React.SetStateAction<boolean>>;
};
