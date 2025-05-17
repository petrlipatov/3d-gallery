import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { forwardRef, useState } from "react";
import { useViewport } from "@/shared/hooks/useViewport";
import { useSpring, config, animated } from "@react-spring/three";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { Props } from "./types";

export const ImagePlane = forwardRef<THREE.Mesh, Props>(
  ({ data, onClick, isDragged }, ref) => {
    const [active, setActive] = useState(false);

    const { width } = useViewport();
    const isMobile = width < 768;
    const { medium, small, id } = data;

    const texture = useLoader(
      THREE.TextureLoader,
      `${BASE_API_URL}${IMAGES_PATH}${isMobile ? small : medium}`
    );

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
        onPointerOut={() => setActive(!active)}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (!isDragged) {
            onClick(id);
          }
        }}
      >
        <planeGeometry args={[1.39, 1]} />
        <meshBasicMaterial map={texture} />
      </animated.mesh>
    );
  }
);
