import type { RandomTile } from "../types/types";

export const getRandomTile = (
  rows: number,
  columns: number,
  tileSize: number,
): RandomTile => {
  const randomColIndex = Math.floor(Math.random() * columns);
  const randomRowIndex = Math.floor(Math.random() * rows);

  return {
    x: randomColIndex * tileSize,
    y: randomRowIndex * tileSize,
  };
};
