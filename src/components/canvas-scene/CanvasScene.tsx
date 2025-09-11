import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useSearchParams } from "react-router";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader, useProgress } from "@react-three/drei";
import { observer } from "mobx-react-lite";

import { About } from "../about";
import { TextsCloud } from "../text-cloud";
import { ImagesCloud } from "../images-cloud";
import { ImagePopup } from "../image-popup/ImagePopup";
import { Navigation } from "../navigation";
import { ControlsMenu } from "../controls-menu";

import { useViewport } from "@/shared/hooks/useViewport";
import { generateRandomPositions } from "@/shared/helpers";
import { storeContext } from "@/shared/constants/contexts";
import { Animations } from "@/shared/constants";
import { Coordinates } from "@/shared/types";

import s from "./CanvasScene.module.css";

export const CanvasScene = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isControlsEnabled, setIsControlsEnabled] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [randomCoordinates, setRandomCoordinate] = useState<Coordinates | null>(
    null
  );
  const [activeAnimation, setActiveAnimation] = useState<Animations>(
    Animations.Shuffle
  );

  const { width } = useViewport();
  const { loaded, total } = useProgress();
  const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const { imagesStore, authStore } = useContext(storeContext);

  const selectedImage = searchParams.get("image");
  const isMobile = width < 768;

  useEffect(
    function setCoordinatesWhenTexuresReady() {
      if (loaded === total) {
        setIsAnimating(true);
        clearAnimationTimer();
        animationTimerRef.current = setInterval(() => {
          setIsAnimating(false);
        }, 4000);
        setRandomCoordinate(
          generateRandomPositions(imagesStore.images?.length)
        );
      }
    },
    [loaded, total, imagesStore.images]
  );

  const clearAnimationTimer = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  const openPopup = useCallback(
    (index: number) => {
      setSearchParams({ image: String(index) });
    },
    [setSearchParams]
  );

  const closePopup = (e: MouseEvent) => {
    setSearchParams({});
    e.stopPropagation();
  };

  const triggerWhomiAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 3000);
    setActiveAnimation(Animations.Whomi);
  };

  const triggerRandomAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => {
      setIsAnimating(false);
      setActiveAnimation(null);
    }, 3000);
    setActiveAnimation(Animations.Random);
  };

  const triggerShuffleAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    if (activeAnimation === Animations.Shuffle) {
      setRandomCoordinate(generateRandomPositions(imagesStore.images.length));
    }
    setActiveAnimation(Animations.Shuffle);
  };

  const triggerByDateAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    setActiveAnimation(Animations.Grid);
  };

  return (
    imagesStore.images && (
      <div className={s.canvasContainer}>
        <Canvas
          camera={{ fov: 75, position: [0, 0, isMobile ? 20 : 15], near: 1 }}
        >
          <Suspense fallback={null}>
            <ImagesCloud
              isAnimating={isAnimating}
              activeAnimation={activeAnimation}
              randomCoordinates={randomCoordinates}
              imageClickHandler={openPopup}
              setIsControlsEnabled={setIsControlsEnabled}
            />
            <TextsCloud activeAnimation={activeAnimation} />
            <About
              activeAnimation={activeAnimation}
              setIsControlsEnabled={setIsControlsEnabled}
            />
          </Suspense>

          <OrbitControls
            enabled={isControlsEnabled}
            enableDamping
            enablePan
            zoomToCursor
            enableRotate={false}
            minDistance={-20}
            maxDistance={isMobile ? 20 : 15}
            mouseButtons={{
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
            }}
            touches={{
              ONE: THREE.TOUCH.PAN,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
          />
        </Canvas>
        <Loader />

        <ControlsMenu
          isAnimating={isAnimating}
          activeAnimation={activeAnimation}
          triggerRandomAnimation={triggerRandomAnimation}
          triggerShuffleAnimation={triggerShuffleAnimation}
          triggerByDateAnimation={triggerByDateAnimation}
          triggerWhomiAnimation={triggerWhomiAnimation}
        />

        {authStore.isAuth && <Navigation location={"Home"} />}
        {selectedImage && (
          <ImagePopup imageId={selectedImage} onClose={closePopup} />
        )}
      </div>
    )
  );
});
