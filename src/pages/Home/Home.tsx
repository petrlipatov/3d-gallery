import { CanvasScene } from "@/components/CanvasScene";
import { ImagesProvider } from "./ImagesProvider/ImagesProvider";

export const Home = () => {
  return (
    <ImagesProvider>
      <CanvasScene />
    </ImagesProvider>
  );
};
