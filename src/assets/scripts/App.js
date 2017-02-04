import preact from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/actions';
import * as ControlModes from 'constants/ControlModes';
import * as EntityTypes from 'constants/EntityTypes';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';
import { templates } from 'factories/createStructure';
import addWheelListener from 'lib/addWheelListener';
import Board from 'svgComponents/Board';
import Entity from 'svgComponents/Entity';


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

  state = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    x: -30,
    y: -30,
  };

  onAnimationFrame = timestamp => {
    this.step(timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
  };

  onMouseWheel = e => {
    e.preventDefault();
    this.setState({
      x: this.state.x - e.wheelDeltaX * this.scrollSpeed,
      y: this.state.y - e.wheelDeltaY * this.scrollSpeed,
    });
  };

  onResize = () => {
    this.setState({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  };

  onKeyUp = e => {
    if (e.code === 'Escape') {
      this.props.actions.setControlMode(ControlModes.DEFAULT);
    }
  };

  onStructureMenuChange = e => {
    const template = templates[e.target.value];
    if (template) {
      this.props.actions.planStructure(e.target.value);
    } else {
      this.props.actions.setControlMode(ControlModes.DEFAULT);
    }
  };

  afRequestId = -1;

  previousTimestamp = -1;

  scrollSpeed = 0.2;

  componentDidMount() {
    // Bind events
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onResize);
    addWheelListener(document.body, this.onMouseWheel);

    // Start!
    this.props.actions.start();
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
    const { actions, board, entities, size, structures, user } = this.props;
    const { width, height, x, y } = this.state;
    const offset = -0.5 * size;
    return (
      <div>
        <SvgRenderer x={x} y={y} width={width} height={height}>
          {(board) && (
            <Board size={size} grid={board.grid} user={user} actions={actions} />
          )}
          {entities.map(entity => <Entity entity={entity} size={size} />)}
          {structures.map(structure => (
            <g transform={`translate(${structure.position.map(p => p * size + offset).join()})`}>
              <rect
                stroke="orange"
                fill="none"
                width={size * structure.size[0]}
                height={size * structure.size[1]}
              />
              <text
                alignment-baseline="middle"
                text-anchor="middle"
                x={size * structure.size[0] / 2}
                y={size * structure.size[1] / 2}
                opacity="0.3">{structure.displayName}</text>
            </g>
          ))}
        </SvgRenderer>
        <UiLayer>
          <div>
            <select onChange={this.onStructureMenuChange}>
              <option>Choose structure</option>
              {Object.keys(templates).map(key => (
                <option value={key}>
                  {templates[key].displayName}
                  {` - `}
                  ({templates[key].cost} steel)
                </option>
              ))}
            </select>
          </div>
          <table className="table">
            <tr>
              <th className="table__header">Food</th>
              <td className="table__data">{user.food}</td>
            </tr>
            <tr>
              <th className="table__header">Steel</th>
              <td className="table__data">{user.steel}</td>
            </tr>
          </table>
        </UiLayer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.board,
  entities: state.entities,
  structures: state.structures,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
