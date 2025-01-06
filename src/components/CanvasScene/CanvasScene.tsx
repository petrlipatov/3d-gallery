import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader, useProgress } from "@react-three/drei";

import { Popup } from "../Popup";
import { About } from "../About";
import { TextsCloud } from "../TextCloud/TextCloud";
import { ImagesCloud } from "../ImagesCloud/ImagesCloud";

import { useViewport } from "@/shared/hooks/useViewport";
import { generateRandomPositions } from "@/shared/helpers";
import { IMAGES } from "@/shared/constants";
import s from "./CanvasScene.module.css";

export function CanvasScene() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [randomCoordinates, setRandomCoordinate] = useState(null);
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState("shuffle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  const animationTimerRef = useRef<NodeJS.Timeout>();
  const { width } = useViewport();
  const { loaded, total } = useProgress();

  const image = searchParams.get("image");
  const isMobile = width < 768;

  const openImage = useCallback(
    (image) => {
      if (!isDragged) {
        setSearchParams({ image });
      }
    },
    [isDragged, setSearchParams]
  );

  useEffect(() => {
    if (loaded === total) {
      setIsAnimating(true);
      clearAnimationTimer();
      animationTimerRef.current = setInterval(() => {
        setIsAnimating(false);
      }, 4000);
      setRandomCoordinate(generateRandomPositions(IMAGES.length));
    }
  }, [loaded, total]);

  const triggerWhomiAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => {
      setIsAnimating(false);
    }, 3000);
    setActiveAnimation("whomi");
  };

  const triggerRandomAnimation = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => {
      setIsAnimating(false);
      setActiveAnimation(null);
    }, 3000);
    setActiveAnimation("random");
  };

  const clearAnimationTimer = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  const closeImage = (e: MouseEvent) => {
    setSearchParams({});
    e.stopPropagation();
  };

  const toggleShuffle = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    if (activeAnimation === "shuffle") {
      const data = generateRandomPositions(IMAGES.length);
      setRandomCoordinate(data);
    }
    setActiveAnimation("shuffle");
  };

  const toggleByDate = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    setActiveAnimation("grid");
  };

  return (
    <div id="canvas-container" className={s.canvasContainer}>
      {image && <Popup image={image} onClose={closeImage} />}
      <Canvas
        camera={{ fov: 75, position: [0, 0, isMobile ? 20 : 15], near: 1 }}
      >
        <Suspense fallback={null}>
          <ImagesCloud
            isDragged={isDragged}
            isAnimating={isAnimating}
            activeAnimation={activeAnimation}
            randomCoordinates={randomCoordinates}
            onClick={openImage} // cached
            setIsControlsEnabled={setIsControlsEnabled} // cached
            setIsDragged={setIsDragged} // cached
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
        <button
          className={`${s.button} ${
            isAnimating && activeAnimation === "random" ? s.buttonAnimation : ""
          }`}
          onClick={triggerRandomAnimation}
        >
          random
          <div className={s.buttonLoader} />
        </button>
        <button
          className={`${s.button} ${
            isAnimating && activeAnimation === "shuffle"
              ? s.buttonAnimation
              : ""
          }`}
          onClick={toggleShuffle}
        >
          shuffle
          <div className={s.buttonLoader} />
        </button>
        <button
          className={`${s.button} ${
            isAnimating && activeAnimation === "grid" ? s.buttonAnimation : ""
          }`}
          onClick={toggleByDate}
        >
          grid
          <div className={s.buttonLoader} />
        </button>

        <button
          className={`${s.button} ${
            isAnimating && activeAnimation === "whomi" ? s.buttonAnimation : ""
          }`}
          onClick={triggerWhomiAnimation}
        >
          whomi
          <div className={s.buttonLoader} />
        </button>
      </div>
    </div>
  );
}
