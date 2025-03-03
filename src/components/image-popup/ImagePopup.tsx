import { MouseEventHandler, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { storeContext } from "@/shared/constants/contexts";
import { Button } from "@/ui/button";
import { LazyImage } from "@/ui/lazy-image";
import { Popup } from "@/ui/popup";
import s from "./ImagePopup.module.css";

export const ImagePopup = ({ image, onClose }) => {
  const { imagesStore, authStore } = useContext(storeContext);
  const navigate = useNavigate();

  const removeHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    imagesStore.deleteImage(image);
    imagesStore.setImages(null);
    navigate("/", { replace: true });
    imagesStore.fetchImages();
  };

  const imageData = imagesStore.images[image];

  return (
    <Popup onClose={onClose}>
      {authStore.isAuth && (
        <Button className={s.removeButton} onClick={removeHandler}>
          Remove
        </Button>
      )}
      <LazyImage
        src={`${BASE_API_URL}${IMAGES_PATH}${imageData.large}`}
        alt="selected-image"
      />
    </Popup>
  );
};
