import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader, useProgress } from "@react-three/drei";

import { Popup } from "../Popup";
import { About } from "../About";
import { TextsCloud } from "../TextCloud";
import { ImagesCloud } from "../ImagesCloud/";
import { Button } from "../Button";

import { useViewport } from "@/shared/hooks/useViewport";
import { generateRandomPositions } from "@/shared/helpers";
import { imagesContext } from "@/shared/constants/contexts";
import { Animations } from "@/shared/constants";
import { Coordinates } from "@/shared/types";
import s from "./CanvasScene.module.css";

export function CanvasScene() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isControlsEnabled, setIsControlsEnabled] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isDragged, setIsDragged] = useState<boolean>(false);
  const [randomCoordinates, setRandomCoordinate] = useState<Coordinates | null>(
    null
  );
  const [activeAnimation, setActiveAnimation] = useState<Animations>(
    Animations.Shuffle
  );

  const { width } = useViewport();
  const { loaded, total } = useProgress();
  const animationTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const imagesData = useContext(imagesContext);

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
        setRandomCoordinate(generateRandomPositions(imagesData?.length));
      }
    },
    [loaded, total, imagesData]
  );

  const clearAnimationTimer = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  const openPopup = useCallback(
    (index: number) => {
      if (!isDragged) setSearchParams({ image: String(index) });
    },
    [isDragged, setSearchParams]
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
      setRandomCoordinate(generateRandomPositions(imagesData.length));
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
    imagesData && (
      <div className={s.canvasContainer}>
        <Canvas
          camera={{ fov: 75, position: [0, 0, isMobile ? 20 : 15], near: 1 }}
        >
          <Suspense fallback={null}>
            <ImagesCloud
              isDragged={isDragged}
              isAnimating={isAnimating}
              activeAnimation={activeAnimation}
              randomCoordinates={randomCoordinates}
              imageClickHandler={openPopup}
              setIsControlsEnabled={setIsControlsEnabled}
              setIsDragged={setIsDragged}
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

        <div className={s.controlsContainer}>
          <Button
            onClick={triggerRandomAnimation}
            isLoading={isAnimating && activeAnimation === Animations.Random}
          >
            {Animations.Random}
          </Button>

          <Button
            onClick={triggerShuffleAnimation}
            isLoading={isAnimating && activeAnimation === Animations.Shuffle}
          >
            {Animations.Shuffle}
          </Button>

          <Button
            onClick={triggerByDateAnimation}
            isLoading={isAnimating && activeAnimation === Animations.Grid}
          >
            {Animations.Grid}
          </Button>

          <Button
            onClick={triggerWhomiAnimation}
            isLoading={isAnimating && activeAnimation === Animations.Whomi}
          >
            {Animations.Whomi}
          </Button>
        </div>

        {selectedImage && <Popup image={selectedImage} onClose={closePopup} />}
      </div>
    )
  );
}
