import uuidV4 from 'uuid/v4';
import * as EntityTypes from 'constants/EntityTypes';


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
