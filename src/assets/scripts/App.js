import preact from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/actions';
import * as EntityTypes from 'constants/EntityTypes';
import * as StructureTypes from 'constants/StructureTypes';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';
import createEntity from 'factories/createEntity';
import createStructure, { templates } from 'factories/createStructure';
import addWheelListener from 'lib/addWheelListener';
import Board from 'svgComponents/Board';


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
    x: 0,
    y: 0,
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

  onStructureMenuChange = e => {
    const template = templates[e.target.value];
    if (template) {
      this.props.actions.planStructure(templates[e.target.value]);
    }
  };

  afRequestId = -1;

  previousTimestamp = -1;

  scrollSpeed = 0.2;

  componentDidMount() {
    // Place some stuff for testing
    this.props.actions.placeStructure(createStructure(StructureTypes.STOCKPILE, {
      position: [ 1, 1 ],
    }));
    this.props.actions.placeStructure(createStructure(StructureTypes.FARM, {
      position: [ 7, 1 ],
    }));
    this.props.actions.placeStructure(createStructure(StructureTypes.NURSERY, {
      position: [ 10, 10 ],
    }));
    this.props.actions.placeStructure(createStructure(StructureTypes.NURSERY, {
      position: [ 20, 3 ],
    }));
    this.props.actions.addEntity(createEntity(EntityTypes.FARMER, { position: [ 10, 2 ] }));

    // Bind events
    window.addEventListener('resize', this.onResize);
    addWheelListener(document.body, this.onMouseWheel);

    // Start!
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
    const { width, height, x, y } = this.state;
    return (
      <div>
        <SvgRenderer x={x} y={y} width={width} height={height}>
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
          <div>
            <select onChange={this.onStructureMenuChange}>
              <option>Choose structure</option>
              {Object.keys(templates).map(key => (
                <option value={key}>{templates[key].displayName}</option>
              ))}
            </select>
          </div>
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
