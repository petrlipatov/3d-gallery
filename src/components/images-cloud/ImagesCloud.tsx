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
const directionVector = new THREE.Vector3();

export const ImagesCloud = observer(
  ({
    activeAnimation,
    randomCoordinates,
    isAnimating,
    imageClickHandler,
    setIsControlsEnabled,
  }: Props) => {
    const refs = useRef([]);
    const { camera, gl } = useThree();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const { imagesStore } = useContext(storeContext);
    const { width } = useViewport();
    const farAway = width < 768 ? 21 : 17;

    const positionsGrid = useMemo(() => {
      return generateGridPositions(imagesStore.images.length);
    }, [imagesStore.images.length]);

    const handleRandomize = useCallback(() => {
      const randomIndex = Math.floor(Math.random() * randomCoordinates.size);
      setSelectedIndex(randomIndex);
    }, [randomCoordinates.size]);

    useFrame(function animationControllers(_, delta) {
      if (!isAnimating) return;

      const clampedDelta = Math.min(delta, 0.03);

      let lambda;
      switch (activeAnimation) {
        case Animations.Grid:
          lambda = 5;
          break;
        case Animations.Shuffle:
          lambda = 3;
          break;
        case Animations.Random:
          lambda = 5.5;
          break;
        case Animations.Whomi:
          lambda = 6.3;
          break;
        default:
          lambda = 5; // Значение по умолчанию
      }

      //     Мы заменили фиксированный шаг на динамический, который сам подстраивается под delta
      // (время, прошедшее с прошлой отрисовки).

      //  * Сценарий 1: Высокий FPS (например, 60)
      //      * delta очень маленькая (~0.0167).
      //      * Формула выдает маленький `alpha` (например, 0.08).
      //      * Код lerp(target, 0.08) делает маленький, короткий шаг.

      //  * Сценарий 2: Низкий FPS (например, 30)
      //      * delta становится в два раза больше (~0.0333).
      //      * Формула, получив большую delta, выдает больший `alpha` (например, 0.15).
      //      * Код lerp(target, 0.15) делает большой шаг, чтобы компенсировать "потерянное" время.

      const alpha = 1 - Math.exp(-lambda * clampedDelta);

      switch (activeAnimation) {
        case Animations.Grid: {
          refs.current.forEach((ref, i) => {
            targetVector.set(...positionsGrid.get(i));

            //  * Кадр 1: lerp перемещает объект на 10% от 100м. Объект проходит 10м. Остается 90м.
            //  * Кадр 2: lerp перемещает объект на 10% от оставшихся 90м. Объект проходит 9м. Остается 81м.
            //  * Кадр 3: lerp перемещает объект на 10% от оставшихся 81м. Объект проходит 8.1м.
            ref.position.lerp(targetVector, alpha);
          });
          break;
        }
        case Animations.Shuffle: {
          refs.current.forEach((ref, i) => {
            targetVector.set(...randomCoordinates.get(i));
            ref.position.lerp(targetVector, alpha);
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
                  camera.getWorldDirection(directionVector).multiplyScalar(2)
                );
              selected.position.lerp(targetVector, alpha);

              refs.current.forEach((ref, i) => {
                if (i !== selectedIndex) {
                  targetVector
                    .copy(ref.position)
                    .setZ(farAway)
                    .add(offsetVector);
                  ref.position.lerp(targetVector, alpha);
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

        const handleDrag = () => {
          setIsControlsEnabled(false);
        };

        const handleDragEnd = () => {
          setIsControlsEnabled(true);
        };

        dragControls.addEventListener("drag", handleDrag);
        dragControls.addEventListener("dragend", handleDragEnd);

        return () => {
          dragControls.removeEventListener("drag", handleDrag);
          dragControls.removeEventListener("dragend", handleDragEnd);
          dragControls.dispose();
        };
      },
      [camera, gl, setIsControlsEnabled, isAnimating]
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
