import { Canvas, useFrame } from "@react-three/fiber";
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
  // useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router";
import { useSpring, animated, config } from "@react-spring/three";
// import { useSpring, animated, config, useSprings } from "@react-spring/three";

const images = [
  { lowres: "/previews/0.jpeg", hires: "/images/0.jpeg" },
  { lowres: "/previews/1.jpeg", hires: "/images/1.jpeg" },
  { lowres: "/previews/2.jpeg", hires: "/images/2.jpeg" },
  { lowres: "/previews/3.jpeg", hires: "/images/3.jpeg" },
  { lowres: "/previews/4.jpeg", hires: "/images/4.jpeg" },
  { lowres: "/previews/5.jpeg", hires: "/images/5.jpeg" },
  { lowres: "/previews/6.jpeg", hires: "/images/6.jpeg" },
  { lowres: "/previews/7.jpeg", hires: "/images/7.jpeg" },
  { lowres: "/previews/8.jpeg", hires: "/images/8.jpeg" },
  { lowres: "/previews/9.jpeg", hires: "/images/9.jpeg" },

  { lowres: "/previews/10.jpeg", hires: "/images/10.jpeg" },
  { lowres: "/previews/11.jpeg", hires: "/images/11.jpeg" },
  { lowres: "/previews/12.jpeg", hires: "/images/12.jpeg" },
  { lowres: "/previews/13.jpeg", hires: "/images/13.jpeg" },
  { lowres: "/previews/14.jpeg", hires: "/images/14.jpeg" },
  { lowres: "/previews/15.jpeg", hires: "/images/15.jpeg" },
  { lowres: "/previews/16.jpeg", hires: "/images/16.jpeg" },
  { lowres: "/previews/17.jpeg", hires: "/images/17.jpeg" },
  { lowres: "/previews/18.jpeg", hires: "/images/18.jpeg" },
  { lowres: "/previews/19.jpeg", hires: "/images/19.jpeg" },

  { lowres: "/previews/20.jpeg", hires: "/images/20.jpeg" },
  { lowres: "/previews/21.jpeg", hires: "/images/21.jpeg" },
  { lowres: "/previews/22.jpeg", hires: "/images/22.jpeg" },
  { lowres: "/previews/23.jpeg", hires: "/images/23.jpeg" },
  { lowres: "/previews/24.jpeg", hires: "/images/24.jpeg" },
  { lowres: "/previews/25.jpeg", hires: "/images/25.jpeg" },
  { lowres: "/previews/26.jpeg", hires: "/images/26.jpeg" },
  { lowres: "/previews/27.jpeg", hires: "/images/27.jpeg" },
  { lowres: "/previews/28.jpeg", hires: "/images/28.jpeg" },
  { lowres: "/previews/29.jpeg", hires: "/images/29.jpeg" },

  { lowres: "/previews/30.jpeg", hires: "/images/30.jpeg" },
  { lowres: "/previews/31.jpeg", hires: "/images/31.jpeg" },
  { lowres: "/previews/32.jpeg", hires: "/images/32.jpeg" },
  { lowres: "/previews/33.jpeg", hires: "/images/33.jpeg" },
  { lowres: "/previews/34.jpeg", hires: "/images/34.jpeg" },
  { lowres: "/previews/35.jpeg", hires: "/images/35.jpeg" },
  { lowres: "/previews/36.jpeg", hires: "/images/36.jpeg" },
  { lowres: "/previews/37.jpeg", hires: "/images/37.jpeg" },
  { lowres: "/previews/38.jpeg", hires: "/images/38.jpeg" },
  { lowres: "/previews/39.jpeg", hires: "/images/39.jpeg" },

  { lowres: "/previews/40.jpeg", hires: "/images/40.jpeg" },
  { lowres: "/previews/41.jpeg", hires: "/images/41.jpeg" },
  { lowres: "/previews/42.jpeg", hires: "/images/42.jpeg" },
  { lowres: "/previews/43.jpeg", hires: "/images/43.jpeg" },
  { lowres: "/previews/44.jpeg", hires: "/images/44.jpeg" },
  { lowres: "/previews/45.jpeg", hires: "/images/45.jpeg" },
  { lowres: "/previews/46.jpeg", hires: "/images/46.jpeg" },
  { lowres: "/previews/47.jpeg", hires: "/images/47.jpeg" },
  { lowres: "/previews/48.jpeg", hires: "/images/48.jpeg" },
  { lowres: "/previews/49.jpeg", hires: "/images/49.jpeg" },

  { lowres: "/previews/50.jpeg", hires: "/images/50.jpeg" },
  { lowres: "/previews/51.jpeg", hires: "/images/51.jpeg" },
  { lowres: "/previews/52.jpeg", hires: "/images/52.jpeg" },
  { lowres: "/previews/53.jpeg", hires: "/images/53.jpeg" },
  { lowres: "/previews/54.jpeg", hires: "/images/54.jpeg" },
  { lowres: "/previews/55.jpeg", hires: "/images/55.jpeg" },
  { lowres: "/previews/56.jpeg", hires: "/images/56.jpeg" },
  { lowres: "/previews/57.jpeg", hires: "/images/57.jpeg" },
  { lowres: "/previews/58.jpeg", hires: "/images/58.jpeg" },
  { lowres: "/previews/59.jpeg", hires: "/images/59.jpeg" },
  { lowres: "/previews/60.jpeg", hires: "/images/60.jpeg" },

  { lowres: "/previews/61.jpeg", hires: "/images/61.jpeg" },
  { lowres: "/previews/62.jpeg", hires: "/images/62.jpeg" },
  { lowres: "/previews/63.jpeg", hires: "/images/63.jpeg" },
  { lowres: "/previews/64.jpeg", hires: "/images/64.jpeg" },
  { lowres: "/previews/65.jpeg", hires: "/images/65.jpeg" },
  { lowres: "/previews/66.jpeg", hires: "/images/66.jpeg" },
  { lowres: "/previews/67.jpeg", hires: "/images/67.jpeg" },
  { lowres: "/previews/68.jpeg", hires: "/images/68.jpeg" },
  { lowres: "/previews/69.jpeg", hires: "/images/69.jpeg" },

  { lowres: "/previews/70.jpeg", hires: "/images/70.jpeg" },
  { lowres: "/previews/71.jpeg", hires: "/images/71.jpeg" },
  { lowres: "/previews/72.jpeg", hires: "/images/72.jpeg" },
  { lowres: "/previews/73.jpeg", hires: "/images/73.jpeg" },
  { lowres: "/previews/74.jpeg", hires: "/images/74.jpeg" },
  { lowres: "/previews/75.jpeg", hires: "/images/75.jpeg" },
  { lowres: "/previews/76.jpeg", hires: "/images/76.jpeg" },
  { lowres: "/previews/77.jpeg", hires: "/images/77.jpeg" },
  { lowres: "/previews/78.jpeg", hires: "/images/78.jpeg" },
  { lowres: "/previews/79.jpeg", hires: "/images/79.jpeg" },

  { lowres: "/previews/80.jpeg", hires: "/images/80.jpeg" },
  { lowres: "/previews/81.jpeg", hires: "/images/81.jpeg" },
  { lowres: "/previews/82.jpeg", hires: "/images/82.jpeg" },
  { lowres: "/previews/83.jpeg", hires: "/images/83.jpeg" },
  { lowres: "/previews/84.jpeg", hires: "/images/84.jpeg" },
  { lowres: "/previews/85.jpeg", hires: "/images/85.jpeg" },
  { lowres: "/previews/86.jpeg", hires: "/images/86.jpeg" },
  { lowres: "/previews/87.jpeg", hires: "/images/87.jpeg" },
  { lowres: "/previews/88.jpeg", hires: "/images/88.jpeg" },
  { lowres: "/previews/89.jpeg", hires: "/images/89.jpeg" },

  { lowres: "/previews/90.jpeg", hires: "/images/90.jpeg" },
  { lowres: "/previews/91.jpeg", hires: "/images/91.jpeg" },
  { lowres: "/previews/92.jpeg", hires: "/images/92.jpeg" },
  { lowres: "/previews/93.jpeg", hires: "/images/93.jpeg" },
  { lowres: "/previews/94.jpeg", hires: "/images/94.jpeg" },
  { lowres: "/previews/95.jpeg", hires: "/images/95.jpeg" },
  { lowres: "/previews/96.jpeg", hires: "/images/96.jpeg" },
  { lowres: "/previews/97.jpeg", hires: "/images/97.jpeg" },
  { lowres: "/previews/98.jpeg", hires: "/images/98.jpeg" },
  { lowres: "/previews/99.jpeg", hires: "/images/99.jpeg" },

  { lowres: "/previews/100.jpeg", hires: "/images/100.jpeg" },
  { lowres: "/previews/101.jpeg", hires: "/images/101.jpeg" },
  { lowres: "/previews/102.jpeg", hires: "/images/102.jpeg" },
  { lowres: "/previews/103.jpeg", hires: "/images/103.jpeg" },
  { lowres: "/previews/104.jpeg", hires: "/images/104.jpeg" },
  { lowres: "/previews/105.jpeg", hires: "/images/105.jpeg" },
  { lowres: "/previews/106.jpeg", hires: "/images/106.jpeg" },
  { lowres: "/previews/107.jpeg", hires: "/images/107.jpeg" },
  { lowres: "/previews/108.jpeg", hires: "/images/108.jpeg" },
  { lowres: "/previews/109.jpeg", hires: "/images/109.jpeg" },

  { lowres: "/previews/110.jpeg", hires: "/images/110.jpeg" },
  { lowres: "/previews/111.jpeg", hires: "/images/111.jpeg" },
  { lowres: "/previews/112.jpeg", hires: "/images/112.jpeg" },
  { lowres: "/previews/113.jpeg", hires: "/images/113.jpeg" },
  { lowres: "/previews/114.jpeg", hires: "/images/114.jpeg" },
  { lowres: "/previews/115.jpeg", hires: "/images/115.jpeg" },
  { lowres: "/previews/116.jpeg", hires: "/images/116.jpeg" },
  { lowres: "/previews/117.jpeg", hires: "/images/117.jpeg" },
  { lowres: "/previews/118.jpeg", hires: "/images/118.jpeg" },
  { lowres: "/previews/119.jpeg", hires: "/images/119.jpeg" },

  { lowres: "/previews/120.jpeg", hires: "/images/120.jpeg" },
  { lowres: "/previews/121.jpeg", hires: "/images/121.jpeg" },
  { lowres: "/previews/122.jpeg", hires: "/images/122.jpeg" },
  { lowres: "/previews/123.jpeg", hires: "/images/123.jpeg" },
  { lowres: "/previews/124.jpeg", hires: "/images/124.jpeg" },
  { lowres: "/previews/125.jpeg", hires: "/images/125.jpeg" },
  { lowres: "/previews/126.jpeg", hires: "/images/126.jpeg" },
  { lowres: "/previews/127.jpeg", hires: "/images/127.jpeg" },
  { lowres: "/previews/128.jpeg", hires: "/images/128.jpeg" },
  { lowres: "/previews/129.jpeg", hires: "/images/129.jpeg" },

  { lowres: "/previews/130.jpeg", hires: "/images/130.jpeg" },
  { lowres: "/previews/131.jpeg", hires: "/images/131.jpeg" },
  { lowres: "/previews/132.jpeg", hires: "/images/132.jpeg" },
  { lowres: "/previews/133.jpeg", hires: "/images/133.jpeg" },
  { lowres: "/previews/134.jpeg", hires: "/images/134.jpeg" },
  { lowres: "/previews/135.jpeg", hires: "/images/135.jpeg" },
  { lowres: "/previews/136.jpeg", hires: "/images/136.jpeg" },
  { lowres: "/previews/137.jpeg", hires: "/images/137.jpeg" },
  { lowres: "/previews/138.jpeg", hires: "/images/138.jpeg" },
  { lowres: "/previews/139.jpeg", hires: "/images/139.jpeg" },

  { lowres: "/previews/140.jpeg", hires: "/images/140.jpeg" },
  { lowres: "/previews/141.jpeg", hires: "/images/141.jpeg" },
  { lowres: "/previews/142.jpeg", hires: "/images/142.jpeg" },
  { lowres: "/previews/143.jpeg", hires: "/images/143.jpeg" },
  { lowres: "/previews/144.jpeg", hires: "/images/144.jpeg" },
  { lowres: "/previews/145.jpeg", hires: "/images/145.jpeg" },
  { lowres: "/previews/146.jpeg", hires: "/images/146.jpeg" },
  { lowres: "/previews/147.jpeg", hires: "/images/147.jpeg" },
  { lowres: "/previews/148.jpeg", hires: "/images/148.jpeg" },
  { lowres: "/previews/149.jpeg", hires: "/images/149.jpeg" },

  { lowres: "/previews/150.jpeg", hires: "/images/150.jpeg" },
  { lowres: "/previews/151.jpeg", hires: "/images/151.jpeg" },
  { lowres: "/previews/152.jpeg", hires: "/images/152.jpeg" },
  { lowres: "/previews/153.jpeg", hires: "/images/153.jpeg" },
  { lowres: "/previews/154.jpeg", hires: "/images/154.jpeg" },
  { lowres: "/previews/155.jpeg", hires: "/images/155.jpeg" },
  { lowres: "/previews/156.jpeg", hires: "/images/156.jpeg" },
  { lowres: "/previews/157.jpeg", hires: "/images/157.jpeg" },
  { lowres: "/previews/158.jpeg", hires: "/images/158.jpeg" },
  { lowres: "/previews/159.jpeg", hires: "/images/159.jpeg" },

  { lowres: "/previews/160.jpeg", hires: "/images/160.jpeg" },
  { lowres: "/previews/161.jpeg", hires: "/images/161.jpeg" },
  { lowres: "/previews/162.jpeg", hires: "/images/162.jpeg" },
  { lowres: "/previews/163.jpeg", hires: "/images/163.jpeg" },
  { lowres: "/previews/164.jpeg", hires: "/images/164.jpeg" },
  { lowres: "/previews/165.jpeg", hires: "/images/165.jpeg" },
  { lowres: "/previews/166.jpeg", hires: "/images/166.jpeg" },
  { lowres: "/previews/167.jpeg", hires: "/images/167.jpeg" },
  { lowres: "/previews/168.jpeg", hires: "/images/168.jpeg" },
  { lowres: "/previews/169.jpeg", hires: "/images/169.jpeg" },

  { lowres: "/previews/170.jpeg", hires: "/images/170.jpeg" },
  { lowres: "/previews/171.jpeg", hires: "/images/171.jpeg" },
  { lowres: "/previews/172.jpeg", hires: "/images/172.jpeg" },
  { lowres: "/previews/173.jpeg", hires: "/images/173.jpeg" },
  { lowres: "/previews/174.jpeg", hires: "/images/174.jpeg" },
  { lowres: "/previews/175.jpeg", hires: "/images/175.jpeg" },
  { lowres: "/previews/176.jpeg", hires: "/images/176.jpeg" },
];

function generateRandom() {
  return Array.from({ length: images.length }, () => {
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

const positionsGrid = generateGridPositions(images.length);

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
    return <div className={s.loader}>loading</div>;
  }

  return <img src={loadedSrc} alt={alt} className={s.image} />;
}

// @ts-expect-error вапва
const ImagePlane = forwardRef(({ data, onClick }, ref) => {
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
      onClick={() => {
        onClick(data.hires);
      }}
      onPointerOver={(e) => {
        setActive(!active);
        e.stopPropagation();
      }}
      onPointerOut={() => setActive(!active)}
    >
      <planeGeometry args={[1.39, 1]} />
      <meshBasicMaterial map={texture} />
    </animated.mesh>
  );
});

const CloudOfImages = ({ activeAnimation, onClick, randomCoordinates }) => {
  const refs = useRef([]);

  useFrame(() => {
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

  return (
    <>
      {randomCoordinates.map((_, index) => {
        const image = images[index % images.length];
        return (
          <ImagePlane
            key={index}
            // @ts-expect-error вапва
            data={image}
            position={randomCoordinates[index]}
            onClick={onClick}
            ref={(el) => {
              refs.current[index] = el;
            }}
          />
        );
      })}
    </>
  );
};

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeAnimation, setActiveAnimation] = useState("shuffle");
  const [randomCoordinates, setRandomCoordinate] = useState(null);

  const image = searchParams.get("image");

  useEffect(() => {
    const data = generateRandom();
    console.log(data);
    setRandomCoordinate(data);
  }, []);

  const openImage = (image) => setSearchParams({ image });
  const closeImage = () => setSearchParams({});

  const toggleShuffle = () => {
    if (activeAnimation === "shuffle") {
      const data = generateRandom();
      setRandomCoordinate(data);
    }
    setActiveAnimation("shuffle");
  };
  const toggleByDate = () => {
    setActiveAnimation("grid");
  };
  const toggleGrid = () => {
    setActiveAnimation("grid");
  };

  return (
    <div id="canvas-container" className={s.canvasContainer}>
      {image && <Popup image={image} onClose={closeImage} />}

      <Canvas camera={{ fov: 75, position: [0, 0, 20] }}>
        <Suspense fallback={null}>
          <CloudOfImages
            onClick={openImage}
            activeAnimation={activeAnimation}
            randomCoordinates={randomCoordinates}
          />
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan
          zoomToCursor
          enableRotate={false}
          minDistance={-20}
          maxDistance={25}
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
        <button onClick={toggleShuffle}>shuffle</button>
        <button onClick={toggleByDate}>by date</button>
        <button onClick={toggleGrid}>grid</button>
      </div>
    </div>
  );
}

export default App;
