import { useState, useEffect } from "react";
import { imagesContext } from "@shared/constants/contexts";

export function ImagesProvider({ children }) {
  const [images, setImages] = useState(null);
  useEffect(() => {
    fetch("https://api.stepanplusdrawingultra.site/images")
      .then((response) => response.json())
      .then((jsonData) => {
        setImages(jsonData);
        console.log(jsonData);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
      });
  }, []);

  return (
    <imagesContext.Provider value={images}>{children}</imagesContext.Provider>
  );
}
