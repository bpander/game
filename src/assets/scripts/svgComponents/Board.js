import preact from 'preact';
import Grid from 'svgComponents/Grid';


export default class Board extends preact.Component {

  static defaultProps = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    grid: [ 0 ],
    size: 1,
    isDirty: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isDirty;
  }

  render() {
    console.log('Board#render');
    const { x, y, width, height, grid, size } = this.props;
    const offset = size / 2 * -1;

    return (
      <g transform={`translate(${x + offset}, ${y + offset})`}>
        <g opacity="0.2">
          {grid.map((cell, i) => {
            if (cell < 1) {
              return;
            }
            const row = i / width | 0;
            const col = i - (row * width);
            return (
              <rect
                x={size * col}
                y={size * row}
                width={size}
                height={size}
                fill={(cell === 0b1) ? 'darkgreen' : 'lightgreen'}
              />
            );
          })}
        </g>
        <Grid width={width} height={height} size={size} />
      </g>
    );
  }
}
