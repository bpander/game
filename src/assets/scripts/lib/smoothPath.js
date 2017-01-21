import { getIndex, getV2, isWalkable } from 'lib/grid';
import lerp from 'lib/lerp';


const hasLineOfSight = (grid, start, final) => {
  const startV2 = getV2(grid, start);
  const finalV2 = getV2(grid, final);
  const yRange = [ startV2[1], finalV2[1] ].sort();
  const [ yMin, yMax ] = yRange;
  const deltaX = finalV2[0] - startV2[0];
  if (deltaX === 0) {
    const x = startV2[0];
    for (let y = yMin; y <= yMax; y++) {
      if (!isWalkable(grid, getIndex(grid, [x, y]))) {
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
    if (!isWalkable(grid, getIndex(grid, [x, y]))) {
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
    debugger;
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
