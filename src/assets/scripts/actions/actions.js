import * as ActionTypes from 'constants/ActionTypes';


export const fetchBoard = (src) => dispatch => {
  return fetch(src)
    .then(response => response.text())
    .then(svgString => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svg = doc.firstElementChild;
      dispatch({ type: ActionTypes.BOARD_UPDATE, board: svg });
    });
};
