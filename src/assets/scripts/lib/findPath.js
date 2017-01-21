
const down = [0, 1];

const isOdd = n => n % 2 === 1;

const isPointInPolygon = (point, polygon) => {
  return isOdd(getCrossingNumber(point, down, polygon));
};

const isSamePoint = (p1, p2) => {
  const threshold = 0.000001;
  return Math.abs(p1[0] - p2[0]) < threshold
    && Math.abs(p1[1] - p2[1]) < threshold;
};

const hasLineOfSight = (points, ray, obstacles) => {
  const rayPoints = ray.map(pointIndex => points[pointIndex]);
  const threshold = 0.00001;
  const rayLength = getDistance(...rayPoints);
  const isBlocked = obstacles.some(obstacle => {
    const polygon = obstacle.map(pointIndex => points[pointIndex]);
    return obstacle.some((startPointIndex, i) => {
      const finalPointIndex = obstacle[(i + 1) % obstacle.length];
      const edge = [ points[startPointIndex], points[finalPointIndex] ];
      const intersection = getIntersection(rayPoints, edge);
      if (isSamePoint(rayPoints[0], intersection)) {
        return false;
      }
      const edgeLength = getDistance(...edge);
      const edgeCrossProduct = getDistance(edge[0], intersection) + getDistance(edge[1], intersection);
      const rayCrossProduct = getDistance(rayPoints[0], intersection) + getDistance(rayPoints[1], intersection);
      const doIntersect = Math.abs(edgeLength - edgeCrossProduct) < threshold
        && Math.abs(rayLength - rayCrossProduct) < threshold;
      if (doIntersect) {
        let triangle;
        let hitIndex;
        let rayFromCenter;
        if (isSamePoint(edge[0], intersection)) {
          triangle = [ obstacle[(i + obstacle.length - 1) % obstacle.length], startPointIndex, finalPointIndex ];
          hitIndex = startPointIndex;

        } else if (isSamePoint(edge[1], intersection)) {
          triangle = [ startPointIndex, finalPointIndex, obstacle[(i + 2) % obstacle.length] ];
          hitIndex = finalPointIndex;
        }
        if (triangle !== undefined) {
          const triPoints = triangle.map(pointIndex => points[pointIndex]);
          const angle1 = Math.atan2(
            triPoints[0][1] * -1 - triPoints[1][1] * -1,
            triPoints[0][0] - triPoints[1][0]
          );
          const angle1Normalize = (angle1 + Math.PI * 2) % (Math.PI * 2);
          const angle2 = Math.atan2(
            triPoints[2][1] * -1 - triPoints[1][1] * -1,
            triPoints[2][0] - triPoints[1][0]
          );
          const angle2Normalize = (angle2 + Math.PI * 2) % (Math.PI * 2);
          const rayFromCenter = ray.slice(0).sort((a, b) => (a !== hitIndex) ? 1 : -1);
          const rayPointsFromCenter = rayFromCenter.map(pointIndex => points[pointIndex]);

          let rayAngle = Math.atan2(
            rayPointsFromCenter[1][1] * -1 - rayPointsFromCenter[0][1] * -1,
            rayPointsFromCenter[1][0] - rayPointsFromCenter[0][0]
          );
          rayAngle = (rayAngle + Math.PI * 2) % (Math.PI * 2);
          if (rayAngle <= angle1Normalize && rayAngle >= angle2Normalize) {
            return false;
          } else {
            // debugger;
            return true;
          }
        }
        ray;
      }
      return doIntersect;
    });
  });
  return !isBlocked;
};

const getCrossingNumber = (origin, direction, polygon) => {
  const threshold = 0.0001;
  const ray = [ origin, origin.map((n, i) => n + direction[i]) ];
  const edges = [
    [ polygon[0], polygon[1] ],
    [ polygon[1], polygon[2] ],
    [ polygon[2], polygon[0] ],
  ];
  return edges.reduce((n, edge) => {
    const edgeLength = getDistance(edge[0], edge[1]);
    const intersection = getIntersection(ray, edge);
    const edgeCrossProduct = getDistance(edge[0], intersection) + getDistance(edge[1], intersection);
    const doIntersect = Math.abs(edgeLength - edgeCrossProduct) < threshold && intersection[1] > ray[0][1];
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

  if (cameFrom[finalPointIndex] === undefined) {
    return null;
  }
  const pathNodeIndexes = [ finalPointIndex ];
  let current = finalPointIndex;
  while ((current = cameFrom[current]) != null) {
    pathNodeIndexes.unshift(current);
  }

  console.log(pathNodeIndexes);
  for (let i = 0; i < pathNodeIndexes.length; i++) {
    const waypoint = pathNodeIndexes[i + 2];
    if (waypoint === undefined) {
      break;
    }
    if (hasLineOfSight(nodes, [ pathNodeIndexes[i], waypoint ], navMesh.obstacles)) {
      pathNodeIndexes.splice(i + 1, 1);
      i = -1;
    }
  }

  return pathNodeIndexes.map(pointIndex => nodes[pointIndex]);
};
