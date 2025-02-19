import { createPortal } from "react-dom";
import { LazyImage } from "@/shared/ui/LazyImage";
import { useContext } from "react";
import { imagesContext } from "@/shared/constants/contexts";
import s from "./Popup.module.css";

export function Popup({ image, onClose }) {
  const imagesData = useContext(imagesContext);
  const imageData = imagesData[image];

  return createPortal(
    <div className={s.popup} onClick={onClose}>
      <div className={s.popupContent}>
        <LazyImage
          src={`https://api.stepanplusdrawingultra.site/images${imageData.large}`}
          alt="selected-image"
        />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
