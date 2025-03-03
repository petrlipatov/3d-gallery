import { createPortal } from "react-dom";
import { useEscapeKey } from "@/shared/hooks/useEscKey";
import s from "./Popup.module.css";

export function Popup({ children, onClose }) {
  useEscapeKey(onClose);

  return createPortal(
    <div className={s.popup} onClick={onClose}>
      <div className={s.popupContent}>{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}
