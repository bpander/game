import uuidV4 from 'uuid/v4';
import * as EntityTypes from 'constants/EntityTypes';
import * as TaskTypes from 'constants/TaskTypes';


const entityBase = {
  type: EntityTypes.NONE,
  path: [],
  position: [ 0, 0 ],
  isSelected: true,
  maxHp: 1,
  hp: 1,
  radius: 0.2,
  speed: 10,
  state: 'idle',
  structure: null,
  task: TaskTypes.NONE,
};

const templates = {

  [EntityTypes.FARMER]: {
    type: EntityTypes.FARMER,
  },

};

export default function createEntity(entityType, overrides) {
  return {
    ...entityBase,
    ...templates[entityType],
    ...{ uuid: uuidV4() },
    ...overrides,
  };
};
