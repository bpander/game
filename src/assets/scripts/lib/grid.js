
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
  return grid;
};

export const getIndex = (grid, v2) => {
  const [ x, y ] = v2;
  if (x < 0 || y < 0 || x > grid.width || y > grid.height) {
    return;
  }
  return y * grid.width + x;
};

export const getManhattanDistance = (startV2, finalV2) => {
  return Math.abs(finalV2[1] - startV2[1]) + Math.abs(finalV2[0] - startV2[0]);
};

export const getNeighbors = (grid, i) => {
  const { data, width } = grid;
  if (data[i] === Infinity) {
    return;
  }
  const neighbors = [];
  const [ x, y ] = getV2(grid, i);
  for (let yi = -1; yi <= 1; yi++) {
    for (let xi = -1; xi <= 1; xi++) {
      if (xi === 0 && yi === 0) {
        continue;
      }
      const neighbor = getIndex(grid, [ x + xi, y + yi ]);
      if (neighbor && data[neighbor] < Infinity) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
};

export const getV2 = (grid, i) => {
  const { width } = grid;
  const y = i / width | 0;
  const x = i - (y * width);
  return [ x, y ];
};

export const makeGrid = (sizeV2, fillValue = 0) => {
  const [ width, height ] = sizeV2;
  return {
    width,
    height,
    data: Array(width * height).fill(fillValue),
  };
};
