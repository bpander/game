import { IDLE, WALKING } from 'constants/TaskTypes';
import * as StructureTypes from 'constants/StructureTypes';
import findPath from 'lib/findPath';
import { getV2 } from 'lib/grid';
import smoothPath from 'lib/smoothPath';


const workOnTask = (entity, state, ms) => {
  switch (entity.task) {
    case WALKING: {
      const v = entity.speed * (ms / 1000);
      const { path, position } = entity;
      const target = path[0];
      const deltaX = target[0] - position[0];
      const deltaY = target[1] - position[1];
      const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
      if (v > distance) {
        path.splice(0, 1);
        entity.position = [ ...target ];
        if (path.length === 0) {
          entity.task = IDLE;
        }
        return entity;
      }
      const angle = Math.atan2(deltaY, deltaX);
      position[0] += v * Math.cos(angle);
      position[1] += v * Math.sin(angle);

      break;
    }
  }
};

export default function reactToWorld(entity, state, ms) {
  if (entity.task) {
    workOnTask(entity, state, ms);
    return entity;
  }
  const { structures } = state;
  const structure = structures.find(structure => structure.uuid === entity.structure);
  if (!structure) {
    return entity;
  }
  switch (structure.type) {
    case StructureTypes.POTATO_PLANTS: {
      const { position } = entity;
      const { grid, neighbors } = state.board;
      const start = position.map(Math.round);
      const final = structure.position.map(Math.round);
      const path = findPath(grid, neighbors, start, final);
      if (path == null) {
        entity.task = IDLE;
        return;
      }
      const smoothedPath = smoothPath(grid, path).map(i => getV2(grid, i));
      entity.path = [ entity.position, ...smoothedPath.slice(1, -1), structure.position ];
      entity.task = WALKING;
      return entity;
    }
  }
};
