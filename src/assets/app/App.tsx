import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import * as THREE from "three";
import s from "./app.module.css";
import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Suspense } from "react";
import { useState } from "react";

const images = [
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
];

function ImagePlane({ data, position, onClick }) {
  const texture = useLoader(THREE.TextureLoader, data.lowres) as THREE.Texture;
  return (
    <mesh
      position={position}
      rotation={[0, 0, 0]}
      onClick={() => onClick(data.hires)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function CloudOfImages({ spacing = 1.5, imagesToRender = 200, onClick }) {
  const positions = useMemo(() => {
    return Array.from({ length: imagesToRender }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radiusX = spacing * 20;
      const radiusY = spacing * 20;

      return [
        Math.cos(angle) * radiusX * Math.random(),
        Math.sin(angle) * radiusY * Math.random(),
        (Math.random() - 0.5) * 7,
      ];
    });
  }, [spacing, imagesToRender]);

  return (
    <>
      {Array.from({ length: imagesToRender }).map((_, index) => {
        const image = images[index % images.length];
        return (
          <ImagePlane
            key={index}
            data={image}
            position={positions[index]}
            onClick={onClick}
          />
        );
      })}
    </>
  );
}

function App() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    console.log(image);
  }, [image]);

  return (
    <div id="canvas-container" className={s.canvasContainer}>
      {image && (
        <div
          className={s.popup}
          onClick={() => {
            setImage(null);
          }}
        >
          <div className={s.popupContent}>
            <img src={image} alt="Selected" />
          </div>
        </div>
      )}

      <Canvas camera={{ fov: 75, position: [0, 0, 10] }}>
        <Suspense fallback={null}>
          <CloudOfImages onClick={setImage} />
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan
          zoomToCursor
          enableRotate={false}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
          }}
        />
      </Canvas>
      <Loader />
    </div>
  );
}

export default App;
