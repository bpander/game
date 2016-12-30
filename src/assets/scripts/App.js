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
      <div>
        Cupcakes.
        <Map src="assets/media/maps/map_test.svg">
          <div>test child</div>
        </Map>
      </div>
    );
  }
}
