import * as THREE from "three";

import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useLayoutEffect, useState } from "react";

export const About = ({ activeAnimation, setIsControlsEnabled }) => {
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [hidden, setHidden] = useState(true);

  const { camera } = useThree();

  useLayoutEffect(() => {
    if (activeAnimation === "whomi") {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      const offsetPosition = new THREE.Vector3()
        .copy(camera.position)
        .add(direction.multiplyScalar(15));
      setPosition(offsetPosition);

      setIsControlsEnabled(false);
    }

    setTimeout(() => {
      setHidden(false);
    }, 500);

    return () => {
      setIsControlsEnabled(true);
      setHidden(true);
    };
  }, [activeAnimation, camera]);

  if (activeAnimation !== "whomi") return null;

  return (
    <Html
      position={position}
      center
      style={{
        transition: "opacity 1s",
        opacity: hidden ? 0 : 1,
      }}
    >
      <div
        style={{
          color: "white",
          width: "300px",
          textDecoration: "none",
        }}
      >
        Hey! My name is Stepan Lipatov. I am a drawing graphic designer and
        educator.
        <br />
        On this web page, you could see almost 200 drawings I did in the last
        two years.
        <br />
        That's how I draw when I don't have an assignment.
        <br />
        <br />
        You could check my other projects on Instagram{" "}
        <a href="https://instagram.com/s7epa" target="_blank">
          @s7epa
        </a>{" "}
        or on my portfolio page:{" "}
        <a href="https://stepanlee.cargo.site" target="_blank">
          https://stepanlee.cargo.site
        </a>
        .
        <br />
        <br />
        If you want to contact me, here is my email:{" "}
        <a href="mailto:stepanlipatov@gmail.com">stepanlipatov@gmail.com</a>.
      </div>
    </Html>
  );
};
