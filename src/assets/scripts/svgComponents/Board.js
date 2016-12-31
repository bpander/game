import preact from 'preact';
import Grid from 'svgComponents/Grid';


export default class Board extends preact.Component {

  static defaultProps = {
    x: 0,
    y: 0,
    size: 1,
  };

  state = {
    data: null,
  };

  componentDidMount() {
    // TODO: the svg should be passed in as a prop
    fetch(this.props.src)
      .then(response => response.text())
      .then(svgString => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svg = doc.firstElementChild;
        this.setState({ data: svg });
      });
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return;
    }

    const { width, height } = data.viewBox.baseVal;
    const { x, y, size } = this.props;
    const rooms = Array.from(data.getElementById('Rooms').children);
    const doors = Array.from(data.getElementById('Doors').children);

    return (
      <g transform={`translate(${x}, ${y})`}>
        {doors.map(door => (
          <rect
            x={door.x.baseVal.value * size}
            y={door.y.baseVal.value * size}
            width={door.width.baseVal.value * size}
            height={door.height.baseVal.value * size}
            fill="rebeccapurple"
          />
        ))}
        {rooms.map(room => (
          <rect
            x={room.x.baseVal.value * size}
            y={room.y.baseVal.value * size}
            width={room.width.baseVal.value * size}
            height={room.height.baseVal.value * size}
            fill="none"
            stroke="green"
           />
        ))}
        <Grid width={width} height={height} size={size} />
      </g>
    );
  }
}
