import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  points: [
    [0,   0],
    [0,   400],
    [750, 400],
    [750, 0],
    [300, 200],
    [200, 300],
    [100, 200],
    [200, 100],
    [600, 50],
    [580, 200],
    [650, 300],
    [550, 350],
    [500, 200],
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

    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 8],
  ],
  triangles: [
    [ 0, 3, 8 ],
    [ 0, 6, 1 ],
    [ 0, 7, 6 ],
    [ 0, 8, 7 ],
    [ 1, 5, 11 ],
    [ 1, 6, 5 ],
    [ 1, 11, 2 ],
    [ 2, 10, 3 ],
    [ 2, 11, 10 ],
    [ 3, 9, 8 ],
    [ 3, 10, 9 ],
    [ 4, 7, 8 ],
    [ 4, 8, 12 ],
    [ 4, 11, 5 ],
    [ 4, 12, 11 ],
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
