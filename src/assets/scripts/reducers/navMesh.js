import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  points: [
    [0,   0],
    [0,   400],
    [400, 400],
    [400, 0],
    [300, 200],
    [200, 300],
    [100, 200],
    [200, 100],
  ],
  neighbors: [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ],
  edges: [
    //Outer loop
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],

    //Inner loop
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
  ],
  triangles: [
    [ 0, 3, 7 ],
    [ 0, 6, 1 ],
    [ 0, 7, 6 ],
    [ 1, 5, 2 ],
    [ 1, 6, 5 ],
    [ 2, 4, 3 ],
    [ 2, 5, 4 ],
    [ 3, 4, 7 ],
  ],
};

// TODO: This has a duplicate definition right now in findPath. This needs to be cleaned up.
const getDistance = (start, final) => {
  return Math.sqrt(
    Math.pow(final[0] - start[0], 2) + Math.pow(final[1] - start[1], 2)
  );
};

initialState.triangles.forEach(triangle => {
  triangle.forEach((pointIndex, i) => {
    const point = initialState.points[pointIndex];
    const nextIndex = triangle[(i + 1) % 3]; // 3 because triangle has 3 points
    if (initialState.neighbors[pointIndex][nextIndex] != null) {
      return;
    }
    const d = getDistance(point, initialState.points[nextIndex]);
    initialState.neighbors[pointIndex][nextIndex] = d;
    initialState.neighbors[nextIndex][pointIndex] = d;
  });
});


const navMesh = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.BOARD_UPDATE:
      return action.board;

    default:
      return state;
  }
};

export default navMesh;
