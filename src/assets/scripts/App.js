import preact from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/actions';
import Board from 'svgComponents/Board';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';


/**
 * Application setup
 *
 * @class App
 */
class App extends preact.Component {

  static defaultProps = {
    board: null,
  };

  onAnimationFrame = timestamp => {
    this.step(timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
  };

  afRequestId = -1;

  previousTimestamp = -1;

  componentDidMount() {
    this.props.actions.fetchBoard('assets/media/maps/map_test.svg');
    this.step();
  }

  step(ms = 17) {
    this.props.actions.step(ms);
    this.afRequestId = requestAnimationFrame(this.onAnimationFrame);
  }

  stop() {
    cancelAnimationFrame(this.afRequestId);
  }

  render() {
    const { actions, board } = this.props;
    return (
      <div>
        <SvgRenderer x="0" y="0" width="800" height="450">
          {(board) && (
            <Board x="20" y="20" size="24" {...board} actions={actions} />
          )}
        </SvgRenderer>
        <UiLayer>
        </UiLayer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.board,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

