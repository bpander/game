
export const fooFaction = () => dispatch => {
  dispatch({ type: 'foo' });
};

export const barFaction = () => ({ type: 'bar' });
