import {
  NONE,
  WALKING_TO_GATHER,
  WALKING_TO_UNLOAD,
  WORKING
} from 'constants/TaskTypes';
import * as StructureTypes from 'constants/StructureTypes';
import clamp from 'lib/clamp';
import findPath from 'lib/findPath';
import { getV2 } from 'lib/grid';
import smoothPath from 'lib/smoothPath';


const setTarget = (entity, state, target) => {
  const { position } = entity;
  const { grid, neighbors } = state.board;
  const start = position.map(Math.round);
  const final = target.map(Math.round);
  const path = findPath(grid, neighbors, start, final);
  if (path == null) {
    return;
  }
  const smoothedPath = smoothPath(grid, path).map(i => getV2(grid, i));
  entity.path = [ entity.position, ...smoothedPath.slice(1, -1), target ];
  return;
};

const getDistance = (startV2, finalV2) => {
  const deltaX = finalV2[0] - startV2[0];
  const deltaY = finalV2[1] - startV2[1];
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
};

const workOnTask = (entity, state, ms) => {
  switch (entity.task) {
    case WALKING_TO_GATHER:
    case WALKING_TO_UNLOAD: {
      const v = entity.speed * (ms / 1000);
      const { path, position } = entity;
      const target = path[0];
      const deltaX = target[0] - position[0];
      const deltaY = target[1] - position[1];
      const distance = getDistance(target, position);
      if (v > distance) {
        path.splice(0, 1);
        entity.position = [ ...target ];
        if (path.length === 0) {
          if (entity.task === WALKING_TO_UNLOAD) {
            state.user.food += 10; // TODO: hardcoded value and resource type
            const structure = state.structures.find(s => s.uuid === entity.structure);
            setTarget(entity, state, structure.position);
            entity.task = WALKING_TO_GATHER;
          } else {
            entity.task = WORKING;
          }
        }
        return entity;
      }
      const angle = Math.atan2(deltaY, deltaX);
      position[0] += v * Math.cos(angle);
      position[1] += v * Math.sin(angle);

      break;
    }
    case WORKING: {
      const progress = clamp(entity.progress + 0.01, undefined, 1);
      if (progress === 1) {
        entity.progress = 0;
        const { position } = entity;
        const nearestStorageStructure = state.structures
          .filter(s => s.type === StructureTypes.COLD_STORAGE)
          .sort((a, b) => {
            const distanceA = getDistance(position, a.position);
            const distanceB = getDistance(position, b.position);
            return distanceA - distanceB;
          })[0];
        if (nearestStorageStructure != null) {
          // TODO: Find first walkable (non-full) tile
          entity.task = WALKING_TO_UNLOAD;
          setTarget(entity, state, nearestStorageStructure.position.map(p => p + 1));
        } else {
          entity.task = -1;
        }
      } else {
        entity.progress = progress;
      }
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
      entity.task = WALKING_TO_GATHER;
      setTarget(entity, state, structure.position);
      return entity;
    }
  }
};
