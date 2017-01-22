import * as ActionTypes from 'constants/ActionTypes';


const clamp = function(n, min, max) {
  return Math.min(Math.max(n, min), max);
};

const entities = (state = [], action) => {
  switch (action.type) {

    case ActionTypes.ADD_ENTITY:
      state.push(action.entity);
      break;

    case ActionTypes.STEP:
      return state.map(entity => {
        if (entity.state === 'walking') {
          const sec = action.ms / 1000;
          entity.v = clamp(entity.v + entity.acceleration * sec, 0, entity.maxV);
          const v = entity.v * sec;
          const { path, position } = entity;
          const target = path[0];
          const deltaX = target[0] - position[0];
          const deltaY = target[1] - position[1];
          const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          if (v > distance) {
            path.splice(0, 1);
            entity.position = [ ...target ];
            if (path.length === 0) {
              entity.v = 0;
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
