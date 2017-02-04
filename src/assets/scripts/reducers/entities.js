import * as ActionTypes from 'constants/ActionTypes';
import * as EntityTypes from 'constants/EntityTypes';
import createEntity from 'factories/createEntity';


const initialState = [
  createEntity(EntityTypes.NONE, { position: [ 10.1, 2.2 ] }),
  createEntity(EntityTypes.NONE, { position: [ 10.5, 3.1 ] }),
  createEntity(EntityTypes.NONE, { position: [ 11.1, 2.8 ] }),
];

const entities = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.ADD_ENTITY:
      state.push(action.entity);
      break;

    case ActionTypes.STEP:
      return [ ...state ];
  }

  return state;
};

export default entities;
