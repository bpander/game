import { combineReducers } from 'redux';
import board from 'reducers/board';

const reducer = combineReducers({
  board,
});

export default reducer;
