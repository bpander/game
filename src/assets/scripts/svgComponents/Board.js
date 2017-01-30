import preact from 'preact';
import * as ControlModes from 'constants/ControlModes';
import { makeGrid } from 'lib/grid';
import createStructure from 'factories/createStructure';
import Grid from 'svgComponents/Grid';


export default class Board extends preact.Component {

  static defaultProps = {
    x: 0,
    y: 0,
    grid: makeGrid([1, 1]),
    size: 1,
  };

  state = {
    plannedStructure: null,
  };

  onClick = e => {
    const { size, user } = this.props;
    const svg = e.currentTarget.ownerSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const scale = svgRect.width / svg.viewBox.baseVal.width;
    const offset = size * -0.5;
    const localX = e.clientX - svgRect.left - targetRect.left + offset;
    const localY = e.clientY - svgRect.top - targetRect.top + offset;
    const scaledSize = size * scale;
    const gridX = localX / scaledSize;
    const gridY = localY / scaledSize;

    if (user.controlMode === ControlModes.PLAN_STRUCTURE) {
      const structure = createStructure(user.target, { position: [ gridX, gridY ].map(Math.round) });
      this.props.actions.placeStructure(structure);
    } else {
      this.props.actions.moveSelectedTo(gridX, gridY);
    }
  };

  onMouseMove = e => {
    const { size, user } = this.props;
    const svg = e.currentTarget.ownerSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const scale = svgRect.width / svg.viewBox.baseVal.width;
    const localX = e.clientX - svgRect.left - targetRect.left;
    const localY = e.clientY - svgRect.top - targetRect.top;
    const scaledSize = size * scale;
    const gridX = localX / scaledSize | 0;
    const gridY = localY / scaledSize | 0;

    if (user.controlMode === ControlModes.PLAN_STRUCTURE) {
      this.setState({
        plannedStructure: createStructure(user.target, { position: [ gridX, gridY ] }),
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.grid !== this.props.grid
      || nextProps.user.controlMode !== this.props.user.controlMode
      || nextState.plannedStructure !== this.state.plannedStructure;
  }

  render() {
    console.log('Board#render');
    const { x, y, grid, size, user } = this.props;
    const { plannedStructure } = this.state;
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
        {(user.controlMode === ControlModes.PLAN_STRUCTURE && plannedStructure != null) && (
          <rect
            x={size * plannedStructure.position[0]}
            y={size * plannedStructure.position[1]}
            width={size * plannedStructure.size[0]}
            height={size * plannedStructure.size[1]}
            fill="none"
            stroke="black"
            style="box-shadow: 0 0 5px red"
          />
        )}
        <rect
          opacity="0"
          width={width * size}
          height={height * size}
          onClick={this.onClick}
          onMouseMove={this.onMouseMove}
        />
      </g>
    );
  }
}
