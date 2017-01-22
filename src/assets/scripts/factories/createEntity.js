import * as EntityTypes from 'constants/EntityTypes';


const entityBase = {
  type: EntityTypes.NONE,
  path: [],
  position: [ 0, 0 ],
  isSelected: true,
  maxHp: 1,
  hp: 1,
  radius: 0.4,
  speed: 10,
  state: 'idle',
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
    ...overrides,
  };
};
