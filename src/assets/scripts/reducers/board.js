import * as ActionTypes from 'constants/ActionTypes';


const board = (state = null, action) => {
  switch (action.type) {

    case ActionTypes.BOARD_UPDATE:
      return action.board;

    default:
      return state;
  }
};

export default board;
