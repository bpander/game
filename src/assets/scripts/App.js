import preact from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import * as factionActions from 'actions/factionActions';
import Board from 'svgComponents/Board';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';


/**
 * Application setup
 *
 * @class App
 */
class App extends preact.Component {

  state = {
    board: null,
    factions: [],
  };

  render() {
    const { actions } = this.props;
    return (
      <div>
        <SvgRenderer x="0" y="0" width="800" height="450">
          <Board src="assets/media/maps/map_test.svg" x="20" y="20" size="20" actions={actions} />
        </SvgRenderer>
        <UiLayer>
        </UiLayer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  factions: state.factions,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(factionActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

