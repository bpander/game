import preact from 'preact';

export default class Map extends preact.Component {

  componentDidMount() {
    fetch(this.props.src)
      .then(response => response.text())
      .then(svgString => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svg = doc.firstElementChild;
        const { width, height } = svg.viewBox.baseVal;
        console.log(width, height);
      });
  }

  render() {
    return (
      <div>
        <div>{this.props.src}</div>
        {this.props.children}
      </div>
    );
  }
}
