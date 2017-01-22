import { getIndex, getV2, isWalkable } from 'lib/grid';
import supercover from 'lib/supercover';


const hasLineOfSight = (grid, start, final) => {
  const startV2 = getV2(grid, start);
  const finalV2 = getV2(grid, final);
  const points = supercover(startV2, finalV2);
  return points.every(v2 => isWalkable(grid, getIndex(grid, v2)));
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
