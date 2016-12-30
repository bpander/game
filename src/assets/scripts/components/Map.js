import preact from 'preact';

export default class Map extends preact.Component {

  state = {
    data: null,
  };

  componentDidMount() {
    fetch(this.props.src)
      .then(response => response.text())
      .then(svgString => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svg = doc.firstElementChild;
        this.setState({ data: svg });
      });
  }

  renderMap() {
    const { data } = this.state;
    return (
      <div>
        Width: {data.viewBox.baseVal.width}
        <br/>
        Height: {data.viewBox.baseVal.height}
        {this.props.children}
      </div>
    );
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {(!data) ? (
          <div>
            {this.props.src}
          </div>
        ) : (
          this.renderMap()
        )}
      </div>
    );
  }
}
