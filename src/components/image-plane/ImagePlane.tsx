import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { forwardRef, useRef, useState } from "react";
import { useViewport } from "@/shared/hooks/useViewport";
import { useSpring, config, animated } from "@react-spring/three";
import { BASE_API_URL, IMAGES_PATH } from "@/shared/constants";
import { Props } from "./types";

export const ImagePlane = forwardRef<THREE.Mesh, Props>(
  ({ data, onClick }, ref) => {
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

    const dragState = useRef({
      isDragging: false,
      startX: 0,
      startY: 0,
    });

    return (
      <animated.mesh
        ref={ref}
        scale={scale}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragState.current = {
            isDragging: false,
            startX: e.clientX,
            startY: e.clientY,
          };
        }}
        onPointerMove={(e) => {
          if (dragState.current.isDragging) return;

          // C помощью теоремы Пифагора a² + b² = c² находим гипотенузу.

          // Почему "простая разница" не работает?
          // Если мы возьмем только разницу по X (3px) или только по Y (4px), это будет неверно. Очевидно,
          // что вы провели пальцем на большее расстояние, чем 3 или 4 пикселя.

          // Если мы просто сложим разницы (3 + 4 = 7), мы получим неверное расстояние. 7 пикселей — это
          // расстояние, которое вы бы прошли, если бы двигались "уголком": сначала 3 пикселя вправо, а
          // потом 4 пикселя вниз. Но вы ведь двигались по прямой!

          // Смысл теоремы Пифагора здесь — найти истинную, кратчайшую дистанцию по прямой, когда движение
          // происходит сразу по двум осям (по диагонали). Простая разница или сумма разниц даст вам
          // неверное, искаженное расстояние, что приведет к неправильной работе "порога срабатывания".

          const distance = Math.sqrt(
            Math.pow(e.clientX - dragState.current.startX, 2) +
              Math.pow(e.clientY - dragState.current.startY, 2)
          );

          if (distance > 10) {
            dragState.current.isDragging = true;
          }
        }}
        onPointerOver={(e) => {
          setActive(!active);
          e.stopPropagation();
        }}
        onPointerOut={() => setActive(!active)}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (!dragState.current.isDragging) {
            onClick(id);
          }
          dragState.current.isDragging = false;
        }}
      >
        <planeGeometry args={[1.39, 1]} />
        <meshBasicMaterial map={texture} />
      </animated.mesh>
    );
  }
);
