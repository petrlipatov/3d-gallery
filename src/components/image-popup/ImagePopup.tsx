import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { storeContext } from "@/shared/constants/contexts";
import { Button } from "@/ui/button";
import { Popup } from "@/ui/popup";
import { ImageComponent } from "@/ui/image";
import { Loader } from "@/ui/loader";
import s from "./ImagePopup.module.css";

export const ImagePopup = ({ imageId, onClose }) => {
  const { imagesStore, authStore } = useContext(storeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const navigate = useNavigate();

  const removeHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    imagesStore.deleteImage(imageId);
    imagesStore.setImages(null);
    imagesStore.fetchImages();
    navigate("/", { replace: true });
  };

  const imageData = imagesStore.images[imageId];

  useEffect(() => {
    const imageSrc = `${BASE_API_URL}${IMAGES_PATH}${imageData.large}`;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setLoadedSrc(imageSrc);
      setIsLoading(false);
    };
  }, [imageId, imageData.large]);

  return (
    <Popup onClose={onClose}>
      {!isLoading ? (
        <>
          <ImageComponent
            className={s.popupImage}
            src={loadedSrc}
            alt={"image"}
          />
          {authStore.isAuth && (
            <Button
              className={s.removeButton}
              size={"lg"}
              onClick={removeHandler}
            >
              Remove
            </Button>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Popup>
  );
};
