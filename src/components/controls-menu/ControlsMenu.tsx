import { Button } from "@/ui/button";
import s from "./ControlsMenu.module.css";
import { Animations } from "@/shared/constants";
import { DragIndicator } from "../drag-indicator";

export const ControlsMenu = ({
  isAnimating,
  activeAnimation,
  triggerRandomAnimation,
  triggerShuffleAnimation,
  triggerByDateAnimation,
  triggerWhomiAnimation,
}) => {
  return (
    <div className={s.controlsContainer}>
      <Button
        onClick={triggerRandomAnimation}
        isLoading={isAnimating && activeAnimation === Animations.Random}
      >
        {Animations.Random}
      </Button>

      <Button
        onClick={triggerShuffleAnimation}
        isLoading={isAnimating && activeAnimation === Animations.Shuffle}
      >
        {Animations.Shuffle}
      </Button>

      <Button
        onClick={triggerByDateAnimation}
        isLoading={isAnimating && activeAnimation === Animations.Grid}
      >
        {Animations.Grid}
      </Button>

      <Button
        onClick={triggerWhomiAnimation}
        isLoading={isAnimating && activeAnimation === Animations.Whomi}
      >
        {Animations.Whomi}
      </Button>

      <DragIndicator isAnimating={isAnimating} />
    </div>
  );
};
