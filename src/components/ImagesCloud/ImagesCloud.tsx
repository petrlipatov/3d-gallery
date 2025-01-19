import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { DragControls } from "three/addons/controls/DragControls.js";
import { ImagePlane } from "../ImagePlane";
import { useViewport } from "@/shared/hooks/useViewport";
import { generateGridPositions } from "@/shared/helpers";
import { IMAGES } from "@/shared/constants";

const positionsGrid = generateGridPositions(IMAGES.length);

export const ImagesCloud = ({
  activeAnimation,
  onClick,
  randomCoordinates,
  setIsControlsEnabled,
  isAnimating,
  setIsDragged,
  isDragged,
}) => {
  const refs = useRef([]);
  const { camera, gl } = useThree();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { width } = useViewport();
  const farAway = width < 768 ? 20 : 15;

  useFrame(() => {
    if (!isAnimating) {
      return;
    }
    if (activeAnimation === "grid") {
      refs.current.forEach((ref, i) => {
        ref.position.lerp(
          new THREE.Vector3(
            positionsGrid[i][0],
            positionsGrid[i][1],
            positionsGrid[i][2]
          ),
          0.08
        );
      });
    } else if (activeAnimation === "shuffle") {
      refs.current.forEach((ref, i) => {
        ref.position.lerp(
          new THREE.Vector3(
            randomCoordinates[i][0],
            randomCoordinates[i][1],
            randomCoordinates[i][2]
          ),
          0.05
        );
      });
    } else if (activeAnimation === "random") {
      if (selectedIndex !== null) {
        const selected = refs.current[selectedIndex];
        if (selected) {
          const targetPosition = camera.position
            .clone()
            .add(
              camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(2)
            );
          selected.position.lerp(targetPosition, 0.09);

          refs.current.forEach((ref, i) => {
            if (i !== selectedIndex) {
              const targetPosition = ref.position.clone() as THREE.Vector3;

              targetPosition.setZ(farAway);
              targetPosition.add(new THREE.Vector3(0, 1, 0));

              ref.position.lerp(targetPosition, 0.1);
            }
          });
        }
      }
    } else if (activeAnimation === "whomi") {
      refs.current.forEach((ref) => {
        const targetPosition = ref.position.clone() as THREE.Vector3;

        targetPosition.setZ(farAway);
        targetPosition.add(new THREE.Vector3(0, 1, 0));

        ref.position.lerp(targetPosition, 0.1);
      });
    }
  });

  useEffect(() => {
    if (isAnimating) {
      return;
    }
    const dragControls = new DragControls(refs.current, camera, gl.domElement);

    dragControls.addEventListener("drag", () => {
      setTimeout(() => {
        setIsDragged(true);
      }, 400);
      setIsControlsEnabled(false);
    });

    dragControls.addEventListener("dragend", () => {
      setTimeout(() => {
        setIsDragged(false);
      }, 400);
      setIsControlsEnabled(true);
    });

    return () => {
      // dragControls.removeEventListener("drag", onDrag);
      // dragControls.removeEventListener("dragend", onDragEnd);
      dragControls.dispose();
    };
  }, [camera, gl, setIsControlsEnabled, isAnimating, setIsDragged]);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * randomCoordinates.length);
    setSelectedIndex(randomIndex);
  };

  useEffect(() => {
    if (activeAnimation === "random") {
      handleRandomize();
    }
  }, [activeAnimation, isAnimating]);

  return (
    <>
      {randomCoordinates.map((_, index) => {
        return (
          <ImagePlane
            key={index}
            data={IMAGES[index]}
            // position={randomCoordinates[index]}
            onClick={onClick}
            ref={(el) => {
              refs.current[index] = el;
            }}
            index={index}
            isDragged={isDragged}
          />
        );
      })}
    </>
  );
};
