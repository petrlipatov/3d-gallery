import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { forwardRef, useState } from "react";
import { useViewport } from "@/shared/hooks/useViewport";
import { useSpring, config, animated } from "@react-spring/three";
interface ImagePlaneProps {
  data: {
    lowresMobile: string;
    lowresDesktop: string;
  };
  onClick: (index: number) => void;
  isDragged: boolean;
  index: number;
}

export const ImagePlane = forwardRef<THREE.Mesh, ImagePlaneProps>(
  ({ data, onClick, isDragged, index }, ref) => {
    const [active, setActive] = useState(false);

    const { width } = useViewport();
    const isMobile = width < 768;

    const { lowresMobile, lowresDesktop } = data;

    const texture = useLoader(
      THREE.TextureLoader,
      isMobile ? lowresMobile : lowresDesktop
    ) as THREE.Texture;

    const { scale } = useSpring({
      scale: active ? 1.2 : 1,
      config: config.wobbly,
    });

    return (
      <animated.mesh
        ref={ref}
        scale={scale}
        onPointerOver={(e) => {
          setActive(!active);
          e.stopPropagation();
        }}
        onPointerOut={() => {
          setActive(!active);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (!isDragged) {
            onClick(index);
          }
        }}
      >
        <planeGeometry args={[1.39, 1]} />
        <meshBasicMaterial map={texture} />
      </animated.mesh>
    );
  }
);
