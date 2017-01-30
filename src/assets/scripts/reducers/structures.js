import * as ActionTypes from 'constants/ActionTypes';
import * as StructureTypes from 'constants/StructureTypes';
import createStructure from 'factories/createStructure';


const initialState = [
  createStructure(StructureTypes.STOCKPILE, { position: [ 0, 0 ] }),
  createStructure(StructureTypes.COLD_STORAGE, { position: [ 0, 4 ] }),
];

const structures = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.PLACE_STRUCTURE:
      state.push(action.structure);
      break;
  }
  return state;
};

export default structures;
