import preact from 'preact';
import Board from 'svgComponents/Board';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';


/**
 * Application setup
 *
 * @class App
 */
export default class App extends preact.Component {
  render() {
    return (
      <div>
        <SvgRenderer x="0" y="0" width="800" height="450">
          <Board src="assets/media/maps/map_test.svg" x="20" y="20" size="20" />
        </SvgRenderer>
        <UiLayer>
        </UiLayer>
      </div>
    );
  }
}
