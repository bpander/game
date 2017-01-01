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
  };

  render() {
    const { x, y, width, height, grid, size } = this.props;

    return (
      <g transform={`translate(${x}, ${y})`}>
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
              fill={(cell === 0b1) ? 'green' : 'purple'}
            />
          );
        })}
        <Grid width={width} height={height} size={size} />
      </g>
    );
  }
}
