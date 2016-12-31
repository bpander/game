import preact from 'preact';


export default class Grid extends preact.Component {

  shouldComponentUpdate(nextProps, nextState) {
    const { width, height, size } = this.props;
    return nextProps.width !== width
      || nextProps.height !== height
      || nextProps.size !== size;
  }

  render() {
    const { width, height, size } = this.props;
    return (
      <g opacity="0.2">
        {Array.from(Array(width + 1)).map((x, i) => (
          <line x1={i * size} y1={0} x2={i * size} y2={height * size} stroke="black" />
        ))}
        {Array.from(Array(height + 1)).map((x, i) => (
          <line x1={0} y1={i * size} x2={width * size} y2={i * size} stroke="black" />
        ))}
      </g>
    );
  }
}
