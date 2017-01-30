import * as ActionTypes from 'constants/ActionTypes';


export const addEntity = entity => ({ type: ActionTypes.ADD_ENTITY, entity });

export const moveSelectedTo = (x, y) => ({ type: ActionTypes.MOVE_SELECTED_TO, position: [x, y] });

export const planStructure = structure => ({ type: ActionTypes.PLAN_STRUCTURE, structure });

export const placeStructure = structure => ({ type: ActionTypes.PLACE_STRUCTURE, structure });

export const setControlMode = controlMode => ({ type: ActionTypes.SET_CONTROL_MODE, controlMode });

export const start = () => ({ type: ActionTypes.START });

export const step = ms => ({ type: ActionTypes.STEP, ms });
