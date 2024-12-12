import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { DragControls } from "three/addons/controls/DragControls.js";

import {
  OrbitControls,
  Loader,
  useProgress,
  Text,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import s from "./app.module.css";
import { useLoader } from "@react-three/fiber";
import {
  useEffect,
  useLayoutEffect,
  Suspense,
  useState,
  useRef,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router";
import { useSpring, animated, config } from "@react-spring/three";
import { IMAGES } from "../../shared/constants";
import { ViewportProvider } from "./providers/viewport-provider";
import { useViewport } from "../../shared/hooks/useViewport";
import { TEXTS } from "../../shared/constants/data";

function generateRandom(len) {
  return Array.from({ length: len }, () => {
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
    <div className={s.popup} onClick={onClose}>
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

const textPositions = generateRandom(TEXTS.length);
const AnimatedText = animated(Text);

const Contacts = ({ activeAnimation, setIsControlsEnabled }) => {
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
    // setHidden(false);

    return () => {
      setIsControlsEnabled(true);
      setHidden(true);
    };
  }, [activeAnimation, camera]);

  // const { opacity } = useSpring({
  //   from: { opacity: 0 },
  //   to: { opacity: activeAnimation === "whomi" ? 1 : 0 },
  //   config: { duration: 3000 },
  // });

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

// const Contacts = ({ activeAnimation, setIsControlsEnabled }) => {
//   const meshRef = useRef();
//   const { camera } = useThree();

//   const { opacity } = useSpring({
//     from: { opacity: 1 },
//     to: { opacity: activeAnimation === "whomi" ? 1 : 0 },
//     config: { duration: 1000 },
//   });

//   useEffect(() => {
//     if (activeAnimation === "whomi" && meshRef.current) {
//       const direction = new THREE.Vector3();
//       camera.getWorldDirection(direction);

//       const offsetPosition = new THREE.Vector3()
//         .copy(camera.position)
//         .add(direction.multiplyScalar(15));

//       // meshRef.current.fillOpacity = 0;

//       // @ts-expect-error вапва

//       meshRef.current.position.copy(offsetPosition);
//       setIsControlsEnabled(false);
//     } else {
//       setIsControlsEnabled(true);
//     }
//   }, [activeAnimation, camera]);

//   if (activeAnimation !== "whomi") return null;

//   return (
//     <group ref={meshRef}>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//         material-opacity={opacity}
//       >
//         Hey! My name is
//       </Text>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="cyan"
//         anchorX="center"
//         anchorY="middle"
//         position={[0, -0.6, 0]} // Смещение текста вниз
//         material-opacity={opacity}
//       >
//         Stepan Lipatov
//       </Text>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//         position={[0, -1.2, 0]} // Еще ниже
//         material-opacity={opacity}
//       >
//         I am a drawing graphic designer and educator.
//       </Text>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="orange"
//         anchorX="center"
//         anchorY="middle"
//         position={[0, -1.8, 0]}
//         material-opacity={opacity}
//         onClick={() => window.open("https://instagram.com/s7epa", "_blank")}
//         style={{ cursor: "pointer" }}
//       >
//         @s7epa
//       </Text>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//         position={[0, -2.4, 0]}
//         material-opacity={opacity}
//       >
//         Or check my portfolio at
//       </Text>
//       <Text
//         fontSize={0.5}
//         lineHeight={1.9}
//         color="orange"
//         anchorX="center"
//         anchorY="middle"
//         position={[0, -3.0, 0]}
//         material-opacity={opacity}
//         onClick={() => window.open("https://stepanlee.cargo.site", "_blank")}
//         style={{ cursor: "pointer" }}
//       >
//         https://stepanlee.cargo.site
//       </Text>
//     </group>
//   );
// };

// const ContactsComp = ({ activeAnimation, setIsControlsEnabled }) => {
//   // const meshRef = useRef();
//   // const { camera } = useThree();

//   const { opacity } = useSpring({
//     from: { opacity: 0 },
//     to: { opacity: activeAnimation === "whomi" ? 1 : 0 },
//     config: { duration: 1000 },
//   });

//   // useEffect(() => {
//   //   if (activeAnimation === "whomi" && meshRef.current) {
//   // const direction = new THREE.Vector3();
//   // camera.getWorldDirection(direction);

//   // const offsetPosition = new THREE.Vector3()
//   //   .copy(camera.position)
//   //   .add(direction.multiplyScalar(15));

//   // meshRef.current.fillOpacity = 0;

//   // @ts-expect-error вапва

//   //     meshRef.current.position.copy(offsetPosition);
//   //     setIsControlsEnabled(false);
//   //   } else {
//   //     setIsControlsEnabled(true);
//   //   }
//   // }, [activeAnimation, camera]);

//   if (activeAnimation !== "whomi") return null;

//   return (
//     <animated.div style={{ opacity }}>
//       Hey! My name is Stepan Lipatov. I am a drawing graphic designer
//       {"\n"} and educator. On this web page you could see almost {"\n"}
//       200 drawings I did in the last two years. That's how I draw{"\n"}
//       when I don't have an assignment. You could check my other projects {"\n"}
//       on my Instagram @s7epa or on my graphic design portfolio page: {"\n"}
//       https://stepanlee.cargo.site/ If you want to contact me,
//       {"\n"}here is my email: stepanlipatov@gmail.com stepanlipatov@gmail.com
//       {"\n"}
//       instagram.com/s7epa
//     </animated.div>
//   );
// };

const AnimatedText2 = ({ text, position, delay }) => {
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
    delay,
  });

  return (
    <AnimatedText
      position={position}
      fontSize={0.1}
      color="white"
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={opacity}
    >
      {text}
    </AnimatedText>
  );
};

const TextsCloud = ({ activeAnimation }) => {
  if (activeAnimation !== "shuffle") return null;

  return TEXTS.map((el, index) => (
    <AnimatedText2
      key={el}
      text={el}
      position={textPositions[index]}
      delay={Math.max(30 * index, 2000)}
    />
  ));
};

// @ts-expect-error вапва
const ImagePlane = forwardRef(({ data, onClick, isDragging }, ref) => {
  const [active, setActive] = useState(false);

  const { width } = useViewport();
  const isMobile = width < 768;

  const { lowresMobile, lowresDesktop } = data;

  const texture = useLoader(
    THREE.TextureLoader,
    isMobile ? lowresMobile : lowresDesktop
  ) as THREE.Texture;

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
        e.stopPropagation();
        if (!isDragging) {
          onClick(data.hires);
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

function CanvasScene() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [randomCoordinates, setRandomCoordinate] = useState(null);
  const [isControlsEnabled, setIsControlsEnabled] = useState(true);
  const [activeAnimation, setActiveAnimation] = useState("shuffle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  const animationTimerRef = useRef<number>();
  const { width } = useViewport();

  const { loaded, total } = useProgress();

  useEffect(() => {
    if (loaded === total) {
      setIsAnimating(true);
      clearAnimationTimer();
      animationTimerRef.current = setInterval(() => {
        setIsAnimating(false);
      }, 4000);
      setRandomCoordinate(generateRandom(IMAGES.length));
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
      const data = generateRandom(IMAGES.length);
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
          <CloudOfImages
            onClick={openImage}
            activeAnimation={activeAnimation}
            randomCoordinates={randomCoordinates}
            setIsControlsEnabled={setIsControlsEnabled}
            isAnimating={isAnimating}
            setIsDragged={setIsDragged}
            isDragged={isDragged}
          />
          {/* <TextsCloud activeAnimation={activeAnimation} /> */}
          <Contacts
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

      {/* <ContactsComp
        activeAnimation={activeAnimation}
        setIsControlsEnabled={setIsControlsEnabled}
      /> */}

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

function App() {
  return (
    <ViewportProvider>
      <CanvasScene />
    </ViewportProvider>
  );
}

export default App;
