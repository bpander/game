import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
import { WALKABLE } from 'constants/TerrainTypes.js';
import findPath from 'lib/findPath';
import smoothPath from 'lib/smoothPath';
import { fillRect, getNeighbors, getV2 } from 'lib/grid';
import board from 'reducers/board';
import entities from 'reducers/entities';
import structures from 'reducers/structures';
import user from 'reducers/user';


const initialState = {
  board: undefined,
  entities: undefined,
  structures: undefined,
  user: undefined,
};

const combined = combineReducers({
  board,
  entities,
  structures,
  user,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.MOVE_SELECTED_TO: {
      state.entities.filter(entity => entity.isSelected).forEach(entity => {
        const { position } = entity;
        const { grid, neighbors } = state.board;
        const start = position.map(Math.round);
        const final = action.position.map(Math.round);
        const path = findPath(grid, neighbors, start, final);
        if (path == null) {
          entity.state = 'idle';
          return;
        }
        const smoothedPath = smoothPath(grid, path).map(i => getV2(grid, i));
        entity.path = [ entity.position, ...smoothedPath.slice(1, -1), action.position ];
        entity.state = 'walking';
      });
      break;
    }

    case ActionTypes.PLACE_STRUCTURE: {
      const { structure } = action;
      const { grid } = state.board;
      state.board.grid = fillRect(grid, structure.position, structure.size, structure.footprint);

      // Bake the neighbors array
      // TODO: This could be memoized
      state.board.neighbors = grid.data.map((d, i) => getNeighbors(grid, i));
      break;
    }

    case ActionTypes.START: {
      const { grid } = state.board;
      state.structures.forEach(structure => {
        state.board.grid = fillRect(grid, structure.position, structure.size, structure.footprint);
      });
      // TODO: This could be memoized
      state.board.neighbors = grid.data.map((d, i) => getNeighbors(grid, i));
      break;
    }

  }
  return combined(state, action);
};


export default reducer;
