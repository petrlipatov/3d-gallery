import { imagesContext, storeContext } from "@shared/constants/contexts";
import { useContext, useEffect, useRef } from "react";

export function ImagesProvider({ children }) {
  const { imagesStore } = useContext(storeContext);
  const storeRef = useRef(imagesStore);

  useEffect(() => {
    if (!storeRef.current.images) {
      storeRef.current.fetchImages();
    }
  }, []);

  return (
    <imagesContext.Provider value={imagesStore}>
      {children}
    </imagesContext.Provider>
  );
}
