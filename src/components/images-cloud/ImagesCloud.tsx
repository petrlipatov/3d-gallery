import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";

import { useFrame, useThree } from "@react-three/fiber";
import { DragControls } from "three/addons/controls/DragControls.js";
import { ImagePlane } from "../image-plane";
import { useViewport } from "@/shared/hooks/useViewport";
import { generateGridPositions } from "@/shared/helpers";
import { storeContext } from "@/shared/constants/contexts";
import { Animations } from "@/shared/constants";

import { Props } from "./types";

const targetVector = new THREE.Vector3();
const offsetVector = new THREE.Vector3(0, 3, 0);

export const ImagesCloud = observer(
  ({
    activeAnimation,
    randomCoordinates,
    isAnimating,
    isDragged,
    imageClickHandler,
    setIsDragged,
    setIsControlsEnabled,
  }: Props) => {
    const refs = useRef([]);
    const { camera, gl } = useThree();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { imagesStore } = useContext(storeContext);
    const { width } = useViewport();
    const farAway = width < 768 ? 21 : 17;

    const dragStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
      null
    );
    const dragEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const positionsGrid = useMemo(() => {
      return generateGridPositions(imagesStore.images.length);
    }, [imagesStore.images.length]);

    const handleRandomize = useCallback(() => {
      const randomIndex = Math.floor(Math.random() * randomCoordinates.size);
      setSelectedIndex(randomIndex);
    }, [randomCoordinates.size]);

    useFrame(function animationControllers() {
      if (!isAnimating) return;

      switch (activeAnimation) {
        case Animations.Grid: {
          refs.current.forEach((ref, i) => {
            targetVector.set(...positionsGrid.get(i));
            ref.position.lerp(targetVector, 0.08);
          });
          break;
        }
        case Animations.Shuffle: {
          refs.current.forEach((ref, i) => {
            targetVector.set(...randomCoordinates.get(i));
            ref.position.lerp(targetVector, 0.05);
          });
          break;
        }
        case Animations.Random: {
          if (selectedIndex !== null) {
            const selected = refs.current[selectedIndex];
            if (selected) {
              targetVector
                .copy(camera.position)
                .add(
                  camera
                    .getWorldDirection(new THREE.Vector3())
                    .multiplyScalar(2)
                );
              selected.position.lerp(targetVector, 0.09);

              refs.current.forEach((ref, i) => {
                if (i !== selectedIndex) {
                  targetVector
                    .copy(ref.position)
                    .setZ(farAway)
                    .add(offsetVector);
                  ref.position.lerp(targetVector, 0.1);
                }
              });
            }
          }
          break;
        }
        case Animations.Whomi: {
          refs.current.forEach((ref) => {
            targetVector.copy(ref.position).setZ(farAway).add(offsetVector);
            ref.position.lerp(targetVector, 0.1);
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
          clearTimeout(dragStartTimerRef.current);
          clearTimeout(dragEndTimerRef.current);
          dragControls.removeEventListener("drag", handleDrag);
          dragControls.removeEventListener("dragend", handleDragEnd);
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
      imagesStore.images && (
        <>
          {Array.from(randomCoordinates.entries()).map((_, index) => {
            return (
              <ImagePlane
                index={index}
                key={imagesStore.images[index].small}
                data={imagesStore.images[index]}
                isDragged={isDragged}
                onClick={imageClickHandler}
                ref={(el) => (refs.current[index] = el)}
              />
            );
          })}
        </>
      )
    );
  }
);
