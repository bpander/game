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
    return (
      <g transform={`translate(${x}, ${y})`}>
        <Grid width={width} height={height} size={size} />
      </g>
    );
  }
}
