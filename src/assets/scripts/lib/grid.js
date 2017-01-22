import { WALKABLE } from 'constants/TerrainTypes';


export const addVectors = (vA, vB) => {
  return vA.map((mag, i) => mag + vB[i]);
};

export const fillRect = (grid, startV2, sizeV2, fillValue) => {
  const { data } = grid;
  const [ x, y ] = startV2;
  const [ w, h ] = sizeV2;
  const top = y;
  const right = x + w;
  const bottom = y + h;
  const left = x;
  for (let yi = top; yi < bottom; yi++) {
    const rowStart = yi * grid.width;
    for (let xi = left; xi < right; xi++) {
      data[rowStart + xi] = fillValue;
    }
  }
  return { ...grid };
};

export const getIndex = (grid, v2) => {
  const [ x, y ] = v2;
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) {
    return;
  }
  return y * grid.width + x;
};

export const getManhattanDistance = (startV2, finalV2) => {
  return Math.abs(finalV2[1] - startV2[1]) + Math.abs(finalV2[0] - startV2[0]);
};

export const getNeighbors = (grid, i) => {
  const { data } = grid;
  if (!isWalkable(grid, i)) {
    return;
  }
  const v2 = getV2(grid, i);

  // Get orthoganal neighbors
  const star = [
    [ 1,  0],
    [ 0,  1],
    [-1,  0],
    [ 0, -1],
  ].map(transform => getIndex(grid, addVectors(v2, transform)));

  // Get diagonal neighbors
  const square = [
    [ 1,  1],
    [-1,  1],
    [-1, -1],
    [ 1, -1],
  ].map(transform => getIndex(grid, addVectors(v2, transform)));

  // Generate walkability data
  const starWalkability = star.map(neighborIndex => isWalkable(grid, neighborIndex));
  const squareWalkability = square.map((neighborIndex, i) => {
    const next = (i + 1) % star.length;
    const isNeighborWalkable = isWalkable(grid, neighborIndex);
    if (isNeighborWalkable) {
      // Don't allow diagonals to cut corners
      return starWalkability[i] && starWalkability[next];
    }
    return false;
  });

  // Merge the walkable orthogonal neighbors with the walkable diagonal neighbors
  const starNeighbors = star.filter((neighborIndex, i) => starWalkability[i]);
  const squareNeighbors = square.filter((neighborIndex, i) => squareWalkability[i]);
  return [ ...starNeighbors, ...squareNeighbors ];
};

export const getV2 = (grid, i) => {
  const { width } = grid;
  const y = i / width | 0;
  const x = i - (y * width);
  return [ x, y ];
};

export const isWalkable = (grid, i) => {
  return grid.data[i] & WALKABLE;
};

export const makeGrid = (sizeV2, fillValue = 0) => {
  const [ width, height ] = sizeV2;
  return {
    width,
    height,
    data: Array(width * height).fill(fillValue),
  };
};
