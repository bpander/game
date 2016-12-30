import preact from 'preact';
import Map from 'components/Map';


/**
 * Application setup
 *
 * @class App
 */
export default class App extends preact.Component {

  static aspectRatio = screen.width / screen.height;

  constructor(props) {
    super(props);
    console.log('app started');
  }

  render() {
    return (
      <div className="aspectRatio" style={{ paddingBottom: `${1 / App.aspectRatio * 100}%` }}>
        <div className="aspectRatio-content">
          Cupcakes.
          <Map src="assets/media/maps/map_test.svg">
            <div>test child</div>
          </Map>
        </div>
      </div>
    );
  }
}
