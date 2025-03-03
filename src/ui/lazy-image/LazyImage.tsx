import { useEffect, useState } from "react";
import { Loader } from "@/ui/loader";
import { Props } from "./types";
import s from "./LazyImage.module.css";

export function LazyImage({ src, alt }: Props) {
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoadedSrc(src);
  }, [src]);

  if (!loadedSrc) {
    return <Loader />;
  }

  return <img className={s.image} src={loadedSrc} alt={alt} />;
}
