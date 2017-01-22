import { getIndex, getV2, isWalkable } from 'lib/grid';


const getOctant = (vA, vB) => {
  const [ x1, y1 ] = vA;
  const [ x2, y2 ] = vB;
  const tau = Math.PI * 2;
  const theta = (Math.atan2(y2 - y1, x2 - x1) + tau) % tau;
  const octantAngle = tau / 8;
  for (let i = 0; i < 8; i++) {
    if (theta < (i + 1) * octantAngle) {
      return i;
    }
  }
};

const switchToOctantZeroFrom = (octant, [ x, y ]) => {
  switch (octant) {
    case 0: return [  x,  y ];
    case 1: return [  y,  x ];
    case 2: return [  y, -x ];
    case 3: return [ -x,  y ];
    case 4: return [ -x, -y ];
    case 5: return [ -y, -x ];
    case 6: return [ -y,  x ];
    case 7: return [  x, -y ];
  }
};

const switchFromOctantZeroTo = (octant, [ x, y ]) => {
  switch (octant) {
    case 0: return [  x,  y ];
    case 1: return [  y,  x ];
    case 2: return [ -y,  x ];
    case 3: return [ -x,  y ];
    case 4: return [ -x, -y ];
    case 5: return [ -y, -x ];
    case 6: return [  y, -x ];
    case 7: return [  x, -y ];
  }
}

const hasLineOfSight = (grid, start, final) => {
  let startV2 = getV2(grid, start);
  let finalV2 = getV2(grid, final);
  const octant = getOctant(startV2, finalV2);
  startV2 = switchToOctantZeroFrom(octant, startV2);
  finalV2 = switchToOctantZeroFrom(octant, finalV2);

  const yRange = [ startV2[1], finalV2[1] ].sort();
  const [ yMin, yMax ] = yRange;
  const deltaX = finalV2[0] - startV2[0];
  if (deltaX === 0) {
    const x = startV2[0];
    for (let y = yMin; y <= yMax; y++) {
      // TODO: Check to make sure we're not cutting across a corner
      const realV2 = switchFromOctantZeroTo(octant, [ x, y ]);
      if (!isWalkable(grid, getIndex(grid, realV2))) {
        return false;
      }
    }
    return true;
  }

  const deltaY = finalV2[1] - startV2[1];
  const deltaErr = Math.abs(deltaY / deltaX);
  let error = deltaErr - 0.5;
  const xRange = [ startV2[0], finalV2[0] ].sort();
  const [ xMin, xMax ] = xRange;
  let y = yMin;
  for (let x = xMin; x <= xMax; x++) {
    const realV2 = switchFromOctantZeroTo(octant, [ x, y ]);
    if (!isWalkable(grid, getIndex(grid, realV2))) {
      return false;
    }
    error = error + deltaErr;
    if (error >= 0.5) {
      y++;
      error--;
    }
  }
  return true;
};

export default function smoothPath (grid, path) {
  let checkPoint = path[0];
  let currentPoint = path[1];
  const next = path.reduce((map, index, i) => {
    return { ...map, [index]: path[i + 1] };
  }, {});
  while (next[currentPoint] !== undefined) {
    if (hasLineOfSight(grid, checkPoint, next[currentPoint])) {
      const temp = currentPoint;
      currentPoint = next[currentPoint];
      path.splice(path.indexOf(temp), 1);
    } else {
      checkPoint = currentPoint;
      currentPoint = next[currentPoint];
    }
  }
  return path;
};
