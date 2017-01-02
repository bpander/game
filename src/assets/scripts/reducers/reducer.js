import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
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
        entity.target = action.position;
        entity.state = 'walking';
      });
      break;

  }
  return combined(state, action);
};


export default reducer;
