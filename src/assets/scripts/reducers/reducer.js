import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
import findPath from 'lib/findPath';
import { getV2 } from 'lib/grid';
import board from 'reducers/board';
import entities from 'reducers/entities';

const initialState = {
  board: undefined,
  entities: [],
};

const combined = combineReducers({
  board,
  entities,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.MOVE_SELECTED_TO:
      state.entities.filter(entity => entity.isSelected).forEach(entity => {
        const { position } = entity;
        const { grid, neighbors } = state.board;
        const start = position.map(Math.floor);
        entity.path = findPath(grid, neighbors, start, action.position).map(i => getV2(grid, i)).reverse();
        entity.state = 'walking';
      });
      break;

  }
  return combined(state, action);
};


export default reducer;
