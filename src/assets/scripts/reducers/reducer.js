import { combineReducers } from 'redux';
import * as ActionTypes from 'constants/ActionTypes.js';
import findPath from 'lib/findPath';
import navMesh from 'reducers/navMesh';
import entities from 'reducers/entities';

const initialState = {
  entities: [],
  navMesh: undefined,
};

const combined = combineReducers({
  entities,
  navMesh,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.MOVE_SELECTED_TO:
      state.entities.filter(entity => entity.isSelected).forEach(entity => {
        const { position } = entity;
        const start = position;
        const path = findPath(state.navMesh, start, action.position);
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
