import * as ActionTypes from 'constants/ActionTypes';
import * as EntityTypes from 'constants/EntityTypes';
import createEntity from 'factories/createEntity';


const initialState = [
  createEntity(EntityTypes.FARMER, { position: [ 0, 2 ] }),
  // createEntity(EntityTypes.NONE, { position: [ 10, 15 ] }),
  // createEntity(EntityTypes.NONE, { position: [ 0, 2 ] }),
];

const entities = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.ADD_ENTITY:
      state.push(action.entity);
      break;

    case ActionTypes.STEP:
      return state.map(entity => {
        if (entity.state === 'walking') {
          const v = entity.speed * (action.ms / 1000);
          const { path, position } = entity;
          const target = path[0];
          const deltaX = target[0] - position[0];
          const deltaY = target[1] - position[1];
          const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          if (v > distance) {
            path.splice(0, 1);
            entity.position = [ ...target ];
            if (path.length === 0) {
              entity.state = 'idle';
            }
            return entity;
          }
          const angle = Math.atan2(deltaY, deltaX);
          position[0] += v * Math.cos(angle);
          position[1] += v * Math.sin(angle);
        }
        return entity;
      });

  }

  return state;
};

export default entities;
