import preact from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/actions';
import SvgRenderer from 'engine/SvgRenderer';
import UiLayer from 'engine/UiLayer';
import NavMesh from 'svgComponents/NavMesh';


/**
 * Application setup
 *
 * @class App
 */
class App extends preact.Component {

  static defaultProps = {
    board: null,
    entities: [],
    isNavMeshVisible: true,
  };

  onAnimationFrame = timestamp => {
    this.step(timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
  };

  afRequestId = -1;

  previousTimestamp = -1;

  componentDidMount() {
    this.props.actions.addEntity({
      isSelected: true,
      path: [],
      position: [100, 50],
      speed: 500, // pixels per second
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
    const { actions, entities, isNavMeshVisible, navMesh } = this.props;
    return (
      <div>
        <SvgRenderer x="0" y="0" width="800" height="450">
          {(isNavMeshVisible) && (
            <NavMesh navMesh={navMesh} actions={actions} />
          )}
          {entities.map(entity => (
            <circle
              cx={entity.position[0]}
              cy={entity.position[1]}
              r={24}
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
  navMesh: state.navMesh,
  entities: state.entities,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

