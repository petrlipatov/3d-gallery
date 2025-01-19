import { CanvasScene } from "@/components/CanvasScene";
import { useEffect, useState } from "react";

export const Home = () => {
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
  return images && <CanvasScene />;
};
