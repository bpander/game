import * as ActionTypes from 'constants/ActionTypes';


export const addEntity = entity => ({ type: ActionTypes.ADD_ENTITY, entity });

export const moveSelectedTo = (x, y) => ({ type: ActionTypes.MOVE_SELECTED_TO, position: [x, y] });

export const placeStructure = structure => ({ type: ActionTypes.PLACE_STRUCTURE, structure });

export const step = ms => ({ type: ActionTypes.STEP, ms });
