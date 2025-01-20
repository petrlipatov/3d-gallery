import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { DragControls } from "three/addons/controls/DragControls.js";
import { ImagePlane } from "../ImagePlane";
import { useViewport } from "@/shared/hooks/useViewport";
import { generateGridPositions } from "@/shared/helpers";
import { imagesContext } from "@/shared/constants/contexts";

const targetVector = new THREE.Vector3();

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
  const imagesData = useContext(imagesContext);
  const { width } = useViewport();
  const farAway = width < 768 ? 20 : 15;

  const dragStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const positionsGrid = useMemo(() => {
    return generateGridPositions(imagesData.length);
  }, [imagesData.length]);

  const handleRandomize = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * randomCoordinates.length);
    setSelectedIndex(randomIndex);
  }, [randomCoordinates.length]);

  useFrame(function animationControllers() {
    if (!isAnimating) return;

    switch (activeAnimation) {
      case "grid": {
        refs.current.forEach((ref, i) => {
          targetVector.set(
            positionsGrid[i][0],
            positionsGrid[i][1],
            positionsGrid[i][2]
          );
          ref.position.lerp(targetVector, 0.08);
        });
        break;
      }
      case "shuffle": {
        refs.current.forEach((ref, i) => {
          targetVector.set(
            randomCoordinates[i][0],
            randomCoordinates[i][1],
            randomCoordinates[i][2]
          );
          ref.position.lerp(targetVector, 0.05);
        });
        break;
      }
      case "random": {
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
        break;
      }
      case "whomi": {
        refs.current.forEach((ref) => {
          const targetPosition = ref.position.clone() as THREE.Vector3;

          targetPosition.setZ(farAway);
          targetPosition.add(new THREE.Vector3(0, 1, 0));

          ref.position.lerp(targetPosition, 0.1);
        });
        break;
      }
    }
  });

  useEffect(
    function setDragControls() {
      if (isAnimating) return;

      const dragControls = new DragControls(
        refs.current,
        camera,
        gl.domElement
      );

      const setDraggingOnWithDelay = () => {
        dragStartTimerRef.current = setTimeout(() => {
          setIsDragged(true);
        }, 400);
        setIsControlsEnabled(false);
      };

      const setDraggingOffWithDelay = () => {
        dragEndTimerRef.current = setTimeout(() => {
          setIsDragged(false);
        }, 400);
        setIsControlsEnabled(true);
      };

      const handleDrag = () => {
        if (dragStartTimerRef.current) {
          return;
        }
        setDraggingOnWithDelay();
      };

      const handleDragEnd = () => {
        if (dragStartTimerRef.current) {
          clearTimeout(dragStartTimerRef.current);
          dragStartTimerRef.current = null;
        }
        if (dragEndTimerRef.current) clearTimeout(dragEndTimerRef.current);

        setDraggingOffWithDelay();
      };

      dragControls.addEventListener("drag", handleDrag);
      dragControls.addEventListener("dragend", handleDragEnd);

      return () => {
        dragControls.removeEventListener("drag", handleDrag);
        dragControls.removeEventListener("dragend", handleDragEnd);
        if (dragStartTimerRef.current) clearTimeout(dragStartTimerRef.current);
        if (dragEndTimerRef.current) clearTimeout(dragEndTimerRef.current);
        dragControls.dispose();
      };
    },
    [camera, gl, setIsControlsEnabled, isAnimating, setIsDragged]
  );

  useEffect(() => {
    if (activeAnimation === "random") {
      handleRandomize();
    }
  }, [activeAnimation, isAnimating, handleRandomize]);

  return (
    imagesData && (
      <>
        {randomCoordinates.map((_, index) => {
          return (
            <ImagePlane
              key={index}
              data={imagesData[index]}
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
    )
  );
};
