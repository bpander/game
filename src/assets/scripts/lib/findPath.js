
const down = [0, 1];

const isOdd = n => n % 2 === 1;

const isPointInPolygon = (point, polygon) => {
  return isOdd(getCrossingNumber(point, down, polygon));
};

const isInRange = (n, range) => {
  range.sort(); // ensure 0th is lower bound, 1st is upper bound.
  return n >= range[0] && n < range[1];
};

const getCrossingNumber = (origin, direction, polygon) => {
  const ray = [ origin, origin.map((n, i) => n + direction[i]) ];
  const edges = [
    [ polygon[0], polygon[1] ],
    [ polygon[1], polygon[2] ],
    [ polygon[2], polygon[0] ],
  ];
  return edges.reduce((n, edge) => {
    const intersection = getIntersection(ray, edge);
    const edgeXRange = edge.map(p => p[0]);
    const doIntersect = isInRange(intersection[0], edgeXRange) && intersection[1] > ray[0][1];
    return (doIntersect) ? n + 1 : n;
  }, 0);
};

const getIntersection = (edge, otherEdge) => {
  const x1 = edge[0][0];
  const y1 = edge[0][1];
  const x2 = edge[1][0];
  const y2 = edge[1][1];
  const x3 = otherEdge[0][0];
  const y3 = otherEdge[0][1];
  const x4 = otherEdge[1][0];
  const y4 = otherEdge[1][1];
  return [
    ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)),
    ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)),
  ];
};

const getGScoreTo = (board, iStart, iFinal) => {
  const startXY = getXY(board, iStart);
  const finalXY = getXY(board, iFinal);
  return (startXY[1] - finalXY[1] === 0 || startXY[0] - finalXY[0] === 0) ? 10 : 14;

};

const getNeighbors = (board, i) => {
  const { width } = board;
  const neighbors = [];
  const [ x, y ] = getXY(board, i);
  for (let yi = -1; yi <= 1; yi++) {
    for (let xi = -1; xi <= 1; xi++) {
      if (xi === 0 && yi === 0) {
        continue;
      }
      const neighbor = getIndex(board, x + xi, y + yi);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
  }
  return neighbors;
};

/**
 * An A* pathfinding function. Adapted from
 * https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
 *
 * @function findPath
 * @param  {Object}   board   A board object.
 * @param  {Vector2}  start   The start coordinate.
 * @param  {Vector2}  goal    The goal coordinate.
 * @return {Array<Vector2>}   An array of coordinates connecting the start with the goal.
 */
export default function findPath(navMesh, start, final) {
  const { points, triangles } = navMesh;
  const polygons = triangles.map(triangle => triangle.map(i => points[i]));
  const startTriIndex = polygons.findIndex(polygon => isPointInPolygon(start, polygon));
  const finalTriIndex = polygons.findIndex(polygon => isPointInPolygon(final, polygon));
  console.log(polygons[startTriIndex]);
  console.log(polygons[finalTriIndex]);
  return;
  const closedSet = [];
  const openSet = [ start ];
  const cameFrom = [];

  const gScore = Array(board.grid.length).fill(Infinity);
  gScore[start] = 0;

  while (openSet.length > 0) {
    const current = openSet.sort(gScoreComparator)[0];
    if (current === final) {
      break;
    }
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);
    getNeighbors(board, current).forEach(neighbor => {
      const isWalkable = board.grid[neighbor] > 0; // TODO: Use a bitmask
      if (!isWalkable || closedSet.includes(neighbor)) {
        return;
      }

      if (openSet.includes(neighbor)) {
        const gScoreOld = gScore[current] + getGScoreTo(board, neighbor, current);
        const gScoreNew = gScore[cameFrom[current]] + getGScoreTo(board, neighbor, cameFrom[current]);
        if (gScoreNew > gScoreOld) {
          cameFrom[neighbor] = cameFrom[current];
          gScore[neighbor] = gScoreNew;
        }
        return;
      }
      openSet.push(neighbor);
      cameFrom[neighbor] = current;
      gScore[neighbor] = gScore[cameFrom[neighbor]] + getGScoreTo(board, neighbor, current);
    });
  }

  if (!cameFrom[final]) {
    return null;
  }
  const path = [ getXY(board, final) ];
  let current = final;
  while ((current = cameFrom[current]) != null) {
    path.unshift(getXY(board, current));
  }
  return path;
};
