import { imagesContext } from "@shared/constants/contexts";
import { ImageData } from "@shared/models";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { useFetch } from "@/shared/hooks";

export function ImagesProvider({ children }) {
  const { data } = useFetch<ImageData[]>(`${BASE_API_URL}${IMAGES_PATH}`);

  return (
    <imagesContext.Provider value={data}>{children}</imagesContext.Provider>
  );
}
