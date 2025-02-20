import { CanvasScene } from "@/components/CanvasScene";
import { ImagesProvider } from "./images-provider";

export const Home = () => {
  return (
    <ImagesProvider>
      <CanvasScene />
    </ImagesProvider>
  );
};
