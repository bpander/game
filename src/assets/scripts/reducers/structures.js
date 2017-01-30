import * as ActionTypes from 'constants/ActionTypes';


const structures = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.PLACE_STRUCTURE:
      state.push(action.structure);
      break;
  }
  return state;
};

export default structures;
