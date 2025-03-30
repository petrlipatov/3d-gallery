import s from "./DragIndicator.module.css";

export const DragIndicator = ({ isAnimating }) => {
  return (
    <div className={s.draggingStatus}>
      <div
        className={`${s.draggingIndicator} ${!isAnimating ? s.active : ""}`}
      />
      dragging
    </div>
  );
};
