export function generateRandomPositions(len): [number, number, number][] {
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

export const generateGridPositions = (
  totalItems: number,
  spacing = 2
): Map<number, [number, number, number]> => {
  const cols = Math.ceil(Math.sqrt(totalItems));
  const rows = Math.ceil(totalItems / cols);

  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;

  const positions = new Map<number, [number, number, number]>();

  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= totalItems) return positions;

      const x = col * spacing - offsetX;
      const y = row * spacing - offsetY;

      positions.set(index, [x, y, 0]);
      index++;
    }
  }

  return positions;
};
