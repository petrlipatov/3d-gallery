import { useEffect, useState } from "react";
import s from "./LazyLoadedImage.module.css";

export function LazyLoadedImage({ src, alt }) {
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoadedSrc(src);
  }, [src]);

  if (!loadedSrc) {
    return <span className={s.loader}/>;
  }

  return <img src={loadedSrc} alt={alt} />;
}
