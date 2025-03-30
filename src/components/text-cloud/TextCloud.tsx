import { TEXTS } from "@/shared/constants/data";
import { generateRandomPositions } from "@/shared/helpers";
import { useSpring, animated } from "@react-spring/three";
import { Text } from "@react-three/drei";

const textPositions = generateRandomPositions(TEXTS.length);

export const TextsCloud = ({ activeAnimation }) => {
  if (activeAnimation !== "shuffle") return null;

  return TEXTS.map((el, index) => (
    <AnimatedText
      key={el}
      text={el}
      position={textPositions.get(index)}
      delay={Math.max(30 * index, 2000)}
    />
  ));
};

const AnimatedTextTag = animated(Text);

const AnimatedText = ({ text, position, delay }) => {
  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 },
    delay,
  });

  return (
    <AnimatedTextTag
      position={position}
      fontSize={0.1}
      color="white"
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={opacity}
    >
      {text}
    </AnimatedTextTag>
  );
};
