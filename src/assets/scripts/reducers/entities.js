import * as ActionTypes from 'constants/ActionTypes';


const entities = (state = [], action) => {
  switch (action.type) {

    case ActionTypes.ADD_ENTITY:
      return [ ...state, action.entity ];

    case ActionTypes.STEP:
      return state.map(entity => {
        // entity.position[0] += 0.01;
        return entity;
      });

    default:
      return state;
  }
};

export default entities;
