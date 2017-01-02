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
        <rect opacity="0" width={width * size} height={height * size} onClick={this.onClick} />
      </g>
    );
  }
}
