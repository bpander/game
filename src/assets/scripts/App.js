import preact from 'preact';
import Board from 'components/Board';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';


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
        <SvgRenderer x="0" y="0" width="800" height="450">
          <Board src="assets/media/maps/map_test.svg" />
        </SvgRenderer>
        <UiLayer>
        </UiLayer>
      </div>
    );
  }
}
