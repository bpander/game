import * as ActionTypes from 'constants/ActionTypes';

export const step = ms => ({ type: ActionTypes.STEP, ms });

const fillRect = (board, { x, y, width, height }, fillValue) => {
  const { grid } = board;
  const top = y;
  const right = x + width;
  const bottom = y + height;
  const left = x;
  for (let yi = top; yi < bottom; yi++) {
    const rowStart = yi * board.width;
    for (let xi = left; xi < right; xi++) {
      grid[rowStart + xi] = fillValue;
    }
  }
  return board;
};

export const fetchBoard = src => dispatch => {
  return fetch(src)
    .then(response => response.text())
    .then(svgString => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const svg = doc.firstElementChild;
      const { width, height } = svg.viewBox.baseVal;
      const grid = Array(width * height).fill(0);
      const board = {
        width,
        height,
        grid,
      };
      // TODO: Clean this stuff up
      const key = (() => {
        const keyNode = doc.getElementById('key');
        return Array.from(keyNode.children).reduce((map, node) => {
          return map.set(node.getAttribute('fill'), node.textContent);
        }, new Map());
      })();
      const neutral = doc.getElementById('neutral');
      Array.from(neutral.children).forEach(node => {
        const type = key.get(node.getAttribute('fill'));
        const fillValue = (type === 'door') ? 0b1 : 0b10;
        fillRect(board, {
          x: node.x.baseVal.value,
          y: node.y.baseVal.value,
          width: node.width.baseVal.value,
          height: node.height.baseVal.value,
        }, fillValue);
      });

      dispatch({ type: ActionTypes.BOARD_UPDATE, board });
    });
};
