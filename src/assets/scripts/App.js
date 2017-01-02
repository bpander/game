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
    entities: [],
    size: 24,
  };

  onAnimationFrame = timestamp => {
    this.step(timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
  };

  afRequestId = -1;

  previousTimestamp = -1;

  componentDidMount() {
    this.props.actions.fetchBoard('assets/media/maps/map_test.svg');
    this.props.actions.addEntity({
      position: [10, 1],
    });
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
    const { actions, board, entities, size } = this.props;
    return (
      <div>
        <SvgRenderer x="-20" y="-20" width="800" height="450">
          {(board) && (
            <Board size={size} {...board} actions={actions} />
          )}
          {entities.map(entity => (
            <circle
              cx={entity.position[0] * size}
              cy={entity.position[1] * size}
              r={size / 2 * 0.8}
              fill="dodgerblue"
            />
          ))}
        </SvgRenderer>
        <UiLayer>
        </UiLayer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.board,
  entities: state.entities,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

