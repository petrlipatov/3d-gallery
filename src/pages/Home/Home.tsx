import { CanvasScene } from "@/components/canvasScene";
import { ImagesProvider } from "./images-provider";

export const Home = () => {
  return (
    <ImagesProvider>
      <CanvasScene />
    </ImagesProvider>
  );
};
