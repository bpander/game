import * as ActionTypes from 'constants/ActionTypes';


const entities = (state = [], action) => {
  switch (action.type) {

    case ActionTypes.ADD_ENTITY:
      state.push(action.entity);
      break;

    case ActionTypes.STEP:
      return state.map(entity => {
        if (entity.state === 'walking') {
          const v = entity.speed * (action.ms / 1000);
          const { target, position } = entity;
          const deltaX = target[0] - position[0];
          const deltaY = target[1] - position[1];
          const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          if (v > distance) {
            entity.state = 'idle';
            entity.position = [ ...target ];
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
