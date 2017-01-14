import preact from 'preact';


export default class NavMesh extends preact.Component {

  onClick = (e) => {
    const svg = e.currentTarget.ownerSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const scale = svgRect.width / svg.viewBox.baseVal.width;
    const localX = e.clientX - svgRect.left - targetRect.left;
    const localY = e.clientY - svgRect.top - targetRect.top;
    this.props.actions.moveSelectedTo(localX / scale, localY / scale);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.navMesh !== this.props.navMesh;
  }

  render (props) {
    const { navMesh } = props;
    const { points, triangles } = navMesh;
    return (
      <g>
        <g onClick={this.onClick}>
          {triangles.map(triangle => (
            <polygon
              points={triangle.map(i => points[i].join(',')).join(' ')}
              fill="rgba(100, 200, 100, 0.4)"
              stroke="rgb(0, 255, 0)"
            />
          ))}
        </g>
        {points.map((point, i) => (
          <g transform={`translate(${point[0]}, ${point[1]})`}>
            <circle
              r={4}
              fill="orange"
            />
            <text x="5" y="20" font-size="32">{i}</text>
          </g>
        ))}
      </g>
    );
  }

};
