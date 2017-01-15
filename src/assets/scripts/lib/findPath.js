
const down = [0, 1];

const isOdd = n => n % 2 === 1;

const isPointInPolygon = (point, polygon) => {
  return isOdd(getCrossingNumber(point, down, polygon));
};

const isInRange = (n, range) => {
  range.sort(); // ensure 0th is lower bound, 1st is upper bound.
  return n >= range[0] && n < range[1];
};

const hasLineOfSight = (ray, edges) => {
  const isBlocked = edges.some(edge => {
    if (ray.includes(edge[0]) || ray.includes(edge[1])) {
      return false;
    }
    const intersection = getIntersection(ray, edge);
    const edgeXRange = edge.map(p => p[0]);
    const edgeYRange = edge.map(p => p[1]);
    const doIntersect = isInRange(intersection[0], edgeXRange)
      && isInRange(intersection[1], edgeYRange);
    return doIntersect;
  });
  return !isBlocked;
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

const getDistance = (start, final) => {
  return Math.sqrt(
    Math.pow(final[0] - start[0], 2) + Math.pow(final[1] - start[1], 2)
  );
};

const getManhattanDistance = (start, final) => {
  return Math.abs(final[0] - start[0]) + Math.abs(final[1] - start[1]);
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
export default function findPath(navMesh, start, final, heuristicFn = getManhattanDistance) {
  const { points, triangles, neighbors } = navMesh;
  const polygons = triangles.map(triangle => triangle.map(i => points[i]));
  // TODO: Optimize point-in-polygon test
  // http://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon
  const startTriIndex = polygons.findIndex(polygon => isPointInPolygon(start, polygon));
  const finalTriIndex = polygons.findIndex(polygon => isPointInPolygon(final, polygon));
  if (startTriIndex === finalTriIndex) {
    return [ start, final ];
  }
  const nodes = [ ...points, start, final ];
  const edges = neighbors.map(neighbor => Object.assign({}, neighbor));
  const startPointIndex = nodes.length - 2;
  const finalPointIndex = startPointIndex + 1;
  edges[startPointIndex] = {};
  edges[finalPointIndex] = {};
  triangles[startTriIndex].forEach(pointIndex => {
    const d = getDistance(points[pointIndex], start);
    edges[startPointIndex][pointIndex] = d;
    edges[pointIndex][startPointIndex] = d;
  });
  triangles[finalTriIndex].forEach(pointIndex => {
    const d = getDistance(points[pointIndex], final);
    edges[finalPointIndex][pointIndex] = d;
    edges[pointIndex][finalPointIndex] = d;
  });

  const closedSet = [];
  const openSet = [ startPointIndex ];
  const cameFrom = [];

  const gScore = Array(nodes.length).fill(Infinity);
  gScore[startPointIndex] = 0;

  const fScore = Array(nodes.length).fill(Infinity);
  fScore[startPointIndex] = heuristicFn(nodes[startPointIndex], nodes[finalPointIndex]);

  const fScoreComparator = (a, b) => fScore[a] - fScore[b];

  while (openSet.length > 0) {
    const current = openSet.sort(fScoreComparator)[0];
    if (current === finalPointIndex) {
      break;
    }
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);
    for (const neighborKey in edges[current]) {
      const neighborIndex = +neighborKey;
      if (closedSet.includes(neighborIndex)) {
        continue;
      }
      const tentativeGScore = gScore[current] + edges[current][neighborIndex];
      if (!openSet.includes(neighborIndex)) { // Discover a new node
        openSet.push(neighborIndex);
      } else if (tentativeGScore >= gScore[neighborIndex]) {
        continue; // This is not a better path.
      }
      // This path is the best until now. Record it!
      cameFrom[neighborIndex] = current;
      gScore[neighborIndex] = tentativeGScore;
      fScore[neighborIndex] = gScore[neighborIndex] + heuristicFn(nodes[neighborIndex], final);
    }
  }

  if (!cameFrom[finalPointIndex]) {
    return null;
  }
  const pathNodeIndexes = [ finalPointIndex ];
  let current = finalPointIndex;
  while ((current = cameFrom[current]) != null) {
    pathNodeIndexes.unshift(current);
  }

  const path = pathNodeIndexes.map(nodeIndex => nodes[nodeIndex]);
  const obstacles = navMesh.edges.slice(4).map(edge => edge.map(pointIndex => points[pointIndex]));
  const smoothedPath = [ path[0] ];
  for (let i = 0; i < path.length; i++) {
    const waypoint = path[i + 2];
    if (waypoint === undefined) {
      smoothedPath.push(path[i + 1]);
      break;
    }
    if (!hasLineOfSight([ path[i], waypoint ], obstacles)) {
      smoothedPath.push(path[i + 1]);
    }
  }
  return smoothedPath;
};
