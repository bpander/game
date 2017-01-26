import * as ActionTypes from 'constants/ActionTypes';
import * as ControlModes from 'constants/ControlModes';


const initialState = {
  controlMode: ControlModes.DEFAULT,
};

const structures = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.SET_CONTROL_MODE:
      return { ...state, controlMode: action.controlMode };

    case ActionTypes.PLAN_STRUCTURE:
      state.controlMode = ControlModes.PLAN_STRUCTURE;
      state.target = action.structure;
      return state;

  }
  return state;
};

export default structures;
