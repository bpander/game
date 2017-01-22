import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
import { WALKABLE } from 'constants/TerrainTypes.js';
import findPath from 'lib/findPath';
import smoothPath from 'lib/smoothPath';
import { fillRect, getNeighbors, getV2 } from 'lib/grid';
import board from 'reducers/board';
import entities from 'reducers/entities';
import structures from 'reducers/structures';


const initialState = {
  board: undefined,
  entities: [],
  structures: [],
};

const combined = combineReducers({
  board,
  entities,
  structures,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.MOVE_SELECTED_TO:
      state.entities.filter(entity => entity.isSelected).forEach(entity => {
        const { position } = entity;
        const { grid, neighbors } = state.board;
        const start = position.map(Math.floor);
        const path = findPath(grid, neighbors, start, action.position);
        if (path == null) {
          entity.state = 'idle';
          return;
        }
        entity.path = smoothPath(grid, path).map(i => getV2(grid, i));
        entity.state = 'walking';
      });
      break;

    case ActionTypes.PLACE_STRUCTURE:
      const { structure } = action;
      const { grid } = state.board;
      state.board.grid = fillRect(grid, structure.position, structure.size, ~WALKABLE);

      // Bake the neighbors array
      // TODO: This could be memoized
      state.board.neighbors = grid.data.map((d, i) => getNeighbors(grid, i));
      break;

  }
  return combined(state, action);
};


export default reducer;
