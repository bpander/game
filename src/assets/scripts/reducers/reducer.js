import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
import findPath from 'lib/findPath';
import board from 'reducers/board';
import entities from 'reducers/entities';

const initialState = {
  board: null,
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
        const start = position.map(Math.floor);
        const path = findPath(state.board, start, action.position);
        if (!path) {
          return;
        }
        entity.path = path;
        entity.state = 'walking';
      });
      break;

  }
  return combined(state, action);
};


export default reducer;
