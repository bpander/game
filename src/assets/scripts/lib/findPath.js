
const getLowestIndex = arr => {
  let currentMin = Infinity;
  return arr.reduce((lowestIndex, value, i) => {
    if (value < currentMin) {
      currentMin = value;
      return i;
    }
    return lowestIndex;
  }, -1);
};

const getIndex = (board, x, y) => {
  if (x < 0 || y < 0 || x > board.width || y > board.height) {
    return;
  }
  return y * board.width + x;
};

const getXY = (board, i) => {
  const { width } = board;
  const y = i / width | 0;
  const x = i - (y * width);
  return [ x, y ];
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
export default function findPath(board, [startX, startY], [finalX, finalY]) {
  const start = getIndex(board, startX, startY);
  const final = getIndex(board, finalX, finalY);
  const closedSet = [];
  const openSet = [ start ];
  const cameFrom = [];
  const gScoreComparator = (a, b) => gScore[a] - gScore[b];

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
