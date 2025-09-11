import { Dispatch } from "react";
import { Coordinates } from "@/shared/types";
import { Animations } from "@/shared/constants";

export type Props = {
  activeAnimation: Animations;
  randomCoordinates: Coordinates;
  isAnimating: boolean;

  imageClickHandler: (index: number) => void;
  setIsControlsEnabled: Dispatch<React.SetStateAction<boolean>>;
};
