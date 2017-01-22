import * as ActionTypes from 'constants/ActionTypes';
import { fillRect, getNeighbors, makeGrid } from 'lib/grid';


const grid = makeGrid([ 25, 20 ], 0);
const initialState = {
  grid,
  neighbors: [],
};

// Add a couple obstacles (for testing purposes)
fillRect(grid, [15, 7], [5,5], Infinity);
fillRect(grid, [10, 5], [1, 10], Infinity);

// Bake the neighbors array
// TODO: This could be memoized
initialState.neighbors = grid.data.map((d, i) => getNeighbors(grid, i));

const board = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.BOARD_UPDATE:
      return action.board;

    default:
      return state;
  }
};

export default board;
