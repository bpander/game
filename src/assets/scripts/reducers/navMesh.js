import * as ActionTypes from 'constants/ActionTypes';

const initialState = {
  points: [
    [-200,-200],
    [-200, 200],
    [ 200, 200],
    [ 200,-200],
    [ 100,   0],
    [   0, 100],
    [-100,   0],
    [   0,-100],
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

const navMesh = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.BOARD_UPDATE:
      return action.board;

    default:
      return state;
  }
};

export default navMesh;
