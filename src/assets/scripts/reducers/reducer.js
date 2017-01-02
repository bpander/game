import { combineReducers } from 'redux';
import board from 'reducers/board';
import entities from 'reducers/entities';

const reducer = combineReducers({
  board,
  entities,
});

export default reducer;
