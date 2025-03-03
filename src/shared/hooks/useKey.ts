import { useEffect, useCallback } from "react";

export function useKey(
  callback: (event: KeyboardEvent) => void,
  key: string | string[]
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (Array.isArray(key) ? key.includes(event.code) : event.code === key) {
        callback(event);
      }
    },
    [callback, key]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
}
