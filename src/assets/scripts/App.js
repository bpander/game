import preact from 'preact';
import Map from 'components/Map';


/**
 * Application setup
 *
 * @class App
 */
export default class App extends preact.Component {

  constructor(props) {
    super(props);
    console.log('app started');
  }

  render() {
    return (
      <div className="aspectRatio aspectRatio_16by9">
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
