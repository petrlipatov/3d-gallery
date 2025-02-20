import { useContext } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/shared/ui/lazy-image";
import { imagesContext } from "@/shared/constants/contexts";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import s from "./Popup.module.css";

export function Popup({ image, onClose }) {
  const imagesData = useContext(imagesContext);
  const imageData = imagesData[image];

  return createPortal(
    <div className={s.popup} onClick={onClose}>
      <div className={s.popupContent}>
        <LazyImage
          src={`${BASE_API_URL}${IMAGES_PATH}${imageData.large}`}
          alt="selected-image"
        />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
