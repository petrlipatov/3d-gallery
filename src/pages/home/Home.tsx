import { CanvasScene } from "@/components/canvas-scene";
import { ImagesProvider } from "./images-provider";

export const Home = () => {
  return (
    <ImagesProvider>
      <CanvasScene />
    </ImagesProvider>
  );
};
