import { useState, useEffect } from "react";
import { imagesContext } from "@shared/constants/contexts";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";

export function ImagesProvider({ children }) {
  const [images, setImages] = useState(null);
  useEffect(() => {
    fetch(`${BASE_API_URL}${IMAGES_PATH}`)
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
