import { IMAGES } from "@/shared/constants";
import { createPortal } from "react-dom";
import s from "./Popup.module.css";
import { LazyLoadedImage } from "@components/LazyLoadedImage";

export function Popup({ image, onClose }) {
  const imageData = IMAGES[image];

  return createPortal(
    <div className={s.popup} onClick={onClose}>
      <div className={s.popupContent}>
        <LazyLoadedImage src={imageData.hires} alt="Selected" />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
