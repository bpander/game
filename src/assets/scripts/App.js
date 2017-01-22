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
    board: undefined,
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
    this.props.actions.placeStructure({
      type: 'stockpile',
      position: [ 1, 1 ],
      size: [ 4, 4 ],
    });
    this.props.actions.placeStructure({
      type: 'farm',
      position: [ 7, 1 ],
      size: [ 3, 3 ],
    });
    this.props.actions.addEntity({
      isSelected: true,
      path: [],
      position: [10, 1],
      radius: 0.4,
      speed: 10, // grid squares per second
      state: 'idle',
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
            <Board size={size} grid={board.grid} actions={actions} />
          )}
          {entities.map(entity => (
            <circle
              cx={size * entity.position[0]}
              cy={size * entity.position[1]}
              r={size * entity.radius}
              fill={(entity.state === 'walking') ? 'blue' : 'dodgerblue'}
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

