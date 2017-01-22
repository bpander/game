import { getManhattanDistance, getIndex, getV2 } from 'lib/grid';


const getGScoreTo = (startV2, finalV2) => {
  const [ startX, startY ] = startV2;
  const [ finalX, finalY ] = finalV2;
  return (finalY - startY === 0 || finalX - startX === 0) ? 10 : 14;
};

const reconstructPath = (cameFrom, current) => {
  const path = [ current ];
  while (cameFrom[current] !== undefined) {
    current = cameFrom[current];
    path.unshift(current);
  }
  return path;
};

/**
 * An A* pathfinding function. Adapted from
 * https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
 *
 * @function findPath
 * @param  {Object}   grid          A grid object (e.g. { width: 1, height: 1, data: [ 0 ] }).
 * @param  {Array}    neighbors     An array of arrays which indicates which cells are walkable
 *                                  from which cells.
 * @param  {Vector2}  startV2       The start coordinate.
 * @param  {Vector2}  finalV2       The goal coordinate.
 * @param  {Function} [heuristicFn] A function that takes two arguments (a start Vector2, and a
 *                                  goal Vector2) and should return a number indicating the
 *                                  estimated cost to traverse between them.
 * @param   {Number}  [weight=50]
 * @return {Array<Number>}  An array of indexes (that reference grid.data) that connect the start
 *                          point with the final point.
 */
export default function findPath(
  grid,
  neighbors,
  startV2,
  finalV2,
  heuristicFn = getManhattanDistance,
  weight = 50
) {
  const start = getIndex(grid, startV2);
  const final = getIndex(grid, finalV2);
  const closedSet = [];
  const openSet = [ start ];
  const cameFrom = {};

  const gScore = Array(grid.data.length).fill(Infinity);
  gScore[start] = 0;

  const fScore = Array(grid.data.length).fill(Infinity);
  fScore[start] = heuristicFn(startV2, finalV2);

  const fScoreComparator = (a, b) => fScore[a] - fScore[b];

  while (openSet.length > 0) {
    const current = openSet.sort(fScoreComparator)[0];
    if (current === final) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    const currentV2 = getV2(grid, current);
    neighbors[current].forEach(neighbor => {
      if (closedSet.includes(neighbor)) {
        return; // Ignore the neighbor which is already evaluated.
      }

      // The distance from start to a neighbor
      const neighborV2 = getV2(grid, neighbor);
      const tentativeGScore = gScore[current] + getGScoreTo(currentV2, neighborV2);

      // Discover a new node
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);

      // This is not a better path.
      } else if (tentativeGScore >= gScore[neighbor]) {
        return;
      }

      // This path is the best until now. Record it!
      cameFrom[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      fScore[neighbor] = gScore[neighbor] + heuristicFn(neighborV2, finalV2) * weight;
    });
  }
};
