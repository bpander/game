import preact from 'preact';
import Board from 'components/Board';


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
          <Board src="assets/media/maps/map_test.svg">
            <div>test child</div>
          </Board>
        </div>
      </div>
    );
  }
}
