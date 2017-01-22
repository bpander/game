import * as ActionTypes from 'constants/ActionTypes';
import * as TerrainTypes from 'constants/TerrainTypes';
import { fillRect, getNeighbors, makeGrid } from 'lib/grid';


const grid = makeGrid([ 40, 20 ], TerrainTypes.WALKABLE | TerrainTypes.BUILDABLE);
const initialState = {
  grid,
  neighbors: [],
};

const board = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.BOARD_UPDATE:
      return action.board;

    default:
      return state;
  }
};

export default board;
