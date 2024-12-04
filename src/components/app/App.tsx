import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { DragControls } from "three/addons/controls/DragControls.js";

import { OrbitControls, Loader } from "@react-three/drei";
import * as THREE from "three";
import s from "./app.module.css";
import { useLoader } from "@react-three/fiber";
import {
  useEffect,
  Suspense,
  useState,
  useRef,
  // memo,
  forwardRef,
  // useImperativeHandle,
  // useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router";
import { useSpring, animated, config } from "@react-spring/three";
import { IMAGES } from "../../shared/constants";
import { ViewportProvider } from "./providers/viewport-provider";
import { useViewport } from "../../shared/hooks/useViewport";

function generateRandom() {
  return Array.from({ length: IMAGES.length }, () => {
    const spacing = 1.5;

    const angle = Math.random() * Math.PI * 2;
    const radiusX = spacing * 20;
    const radiusY = spacing * 20;

    return [
      Math.cos(angle) * radiusX * Math.random(),
      Math.sin(angle) * radiusY * Math.random(),
      Math.random() * 10,
    ];
  });
}

const generateGridPositions = (totalItems, spacing = 2) => {
  const cols = Math.ceil(Math.sqrt(totalItems));
  const rows = Math.ceil(totalItems / cols);

  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;

  const positions = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (positions.length >= totalItems) return positions;

      const x = col * spacing - offsetX;
      const y = row * spacing - offsetY;

      positions.push([x, y, 0]);
    }
  }

  return positions;
};

const positionsGrid = generateGridPositions(IMAGES.length);

function Popup({ image, onClose }) {
  return createPortal(
    <div className={s.popup} onClick={onClose} onTouchStart={onClose}>
      <div className={s.popupContent}>
        <LazyLoadedImage src={image} alt="Selected" />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

function LazyLoadedImage({ src, alt }) {
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoadedSrc(src);
  }, [src]);

  if (!loadedSrc) {
    return <span className={s.loader}></span>;
  }

  return <img src={loadedSrc} alt={alt} className={s.image} />;
}

// @ts-expect-error вапва
const ImagePlane = forwardRef(({ data, onClick, isDragging }, ref) => {
  const [active, setActive] = useState(false);

  const texture = useLoader(THREE.TextureLoader, data.lowres) as THREE.Texture;

  const { scale } = useSpring({
    scale: active ? 1.2 : 1,
    config: config.wobbly,
  });

  return (
    <animated.mesh
      // @ts-expect-error вапва

      ref={ref}
      scale={scale}
      onPointerOver={(e) => {
        setActive(!active);
        e.stopPropagation();
      }}
      onPointerOut={() => {
        setActive(!active);
      }}
      onClick={(e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        if (!isDragging) {
          // Только если не перетаскивается
          onClick(data.hires); // Открываем картинку
        }
      }}
    >
      <planeGeometry args={[1.39, 1]} />
      <meshBasicMaterial map={texture} />
    </animated.mesh>
  );
});

const CloudOfImages = ({
  activeAnimation,
  onClick,
  randomCoordinates,
  setIsControlsEnabled,
  isAnimating,
  setIsDragged,
  isDragged,
  // allAnimationsCompleted,
  // setAllAnimationsCompleted,
}) => {
  const refs = useRef([]);
  const { camera, gl } = useThree(); // Получаем камеру и рендерер

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
          0.05
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
    }
  });

  useEffect(() => {
    if (isAnimating) {
      return;
    }
    const dragControls = new DragControls(refs.current, camera, gl.domElement);

    console.log(dragControls);
    dragControls.addEventListener("drag", () => {
      setTimeout(() => {
        setIsDragged(true);
      }, 100);
      setIsControlsEnabled(false);
    });

    dragControls.addEventListener("dragend", () => {
      setIsDragged(false);
      setIsControlsEnabled(true);
    });

    return () => {
      // dragControls.removeEventListener("drag", onDrag);
      // dragControls.removeEventListener("dragend", onDragEnd);
      dragControls.dispose();
    };
  }, [camera, gl, setIsControlsEnabled, isAnimating, setIsDragged]);

  return (
    <>
      {randomCoordinates.map((_, index) => {
        return (
          <ImagePlane
            key={index}
            // @ts-expect-error вапва
            data={IMAGES[index]}
            position={randomCoordinates[index]}
            onClick={onClick}
            ref={(el) => {
              refs.current[index] = el;
            }}
            isDragged={isDragged}
          />
        );
      })}
    </>
  );
};

function Scene() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [randomCoordinates, setRandomCoordinate] = useState(null);
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState("shuffle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  const animationTimerRef = useRef<number>();
  const { width } = useViewport();

  const clearAnimationTimer = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  };

  useEffect(() => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    setRandomCoordinate(generateRandom());
  }, []);

  const image = searchParams.get("image");

  const isMobile = width < 768;

  const openImage = (image) => {
    if (!isDragged) {
      setSearchParams({ image });
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
      const data = generateRandom();
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
  const toggleGrid = () => {
    setIsAnimating(true);
    clearAnimationTimer();
    animationTimerRef.current = setInterval(() => setIsAnimating(false), 4000);
    setActiveAnimation("grid");
  };

  return (
    <div id="canvas-container" className={s.canvasContainer}>
      {image && <Popup image={image} onClose={closeImage} />}
      <Canvas camera={{ fov: 75, position: [0, 0, isMobile ? 20 : 15] }}>
        <Suspense fallback={null}>
          <CloudOfImages
            onClick={openImage}
            activeAnimation={activeAnimation}
            randomCoordinates={randomCoordinates}
            setIsControlsEnabled={setIsControlsEnabled}
            isAnimating={isAnimating}
            setIsDragged={setIsDragged}
            isDragged={isDragged}
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
        <button className={s.button} onClick={toggleShuffle}>
          shuffle
        </button>
        <button onClick={toggleByDate}>by date</button>
        <button onClick={toggleGrid}>grid</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ViewportProvider>
      <Scene />
    </ViewportProvider>
  );
}

export default App;
