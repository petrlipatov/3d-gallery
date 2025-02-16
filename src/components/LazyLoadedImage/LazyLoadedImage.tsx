import { useEffect, useState } from "react";
import { Loader } from "@/shared/ui/Loader";

export function LazyLoadedImage({ src, alt }) {
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoadedSrc(src);
  }, [src]);

  if (!loadedSrc) {
    return <Loader />;
  }

  return <img src={loadedSrc} alt={alt} />;
}
