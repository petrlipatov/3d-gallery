import { useEffect } from "react";

export function useEscapeKey(callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback]);
}
