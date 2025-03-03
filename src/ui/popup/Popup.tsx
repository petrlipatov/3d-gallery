import { createPortal } from "react-dom";
import { useKey } from "@/shared/hooks/useKey";
import s from "./Popup.module.css";

export function Popup({ children, onClose }) {
  useKey(onClose, ["Escape", "Space"]);

  return createPortal(
    <div className={s.popup} onClick={onClose}>
      <div className={s.popupContent}>{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}
