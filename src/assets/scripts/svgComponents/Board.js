import preact from 'preact';
import { makeGrid } from 'lib/grid';
import Grid from 'svgComponents/Grid';


export default class Board extends preact.Component {

  static defaultProps = {
    x: 0,
    y: 0,
    grid: makeGrid([1, 1]),
    size: 1,
  };

  onClick = e => {
    const { size } = this.props;
    const svg = e.currentTarget.ownerSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const scale = svgRect.width / svg.viewBox.baseVal.width;
    const localX = e.clientX - svgRect.left - targetRect.left;
    const localY = e.clientY - svgRect.top - targetRect.top;
    const scaledSize = size * scale;
    const gridX = localX / scaledSize | 0;
    const gridY = localY / scaledSize | 0;
    this.props.actions.moveSelectedTo(gridX, gridY);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.grid !== this.props.grid;
  }

  render() {
    console.log('Board#render');
    const { x, y, grid, size } = this.props;
    const { width, height } = grid;
    const offset = size / 2 * -1;

    return (
      <g transform={`translate(${x + offset}, ${y + offset})`}>
        <g opacity="0.2">
          {grid.data.map((cell, i) => {
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
        <rect opacity="0" width={width * size} height={height * size} onClick={this.onClick} />
      </g>
    );
  }
}
