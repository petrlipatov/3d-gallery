import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { storeContext } from "@/shared/constants/contexts";
import { LazyImage } from "@/ui/lazy-image";
import { Popup } from "@/ui/popup";
import { useContext } from "react";

export const ImagePopup = ({ image, onClose }) => {
  const { imagesStore } = useContext(storeContext);
  const imageData = imagesStore.images[image];

  return (
    <Popup onClose={onClose}>
      <LazyImage
        src={`${BASE_API_URL}${IMAGES_PATH}${imageData.large}`}
        alt="selected-image"
      />
    </Popup>
  );
};
