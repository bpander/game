import { WALKABLE, BUILDABLE } from 'constants/TerrainTypes';
import * as StructureTypes from 'constants/StructureTypes';

const [ W, B ] = [ WALKABLE, BUILDABLE ];

const structureBase = {
  type: StructureTypes.NONE,
  cost: 0,
  displayName: '',
  position: [ 0, 0 ],
  size: [ 2, 2 ],
  footprint: [
    0, W,
    W, W,
  ],
};

export const templates = {

  [StructureTypes.COLD_STORAGE]: {
    type: StructureTypes.COLD_STORAGE,
    cost: 20,
    displayName: 'Cold storage',
    size: [ 4, 5 ],
    footprint: [
      0, 0, 0, 0,
      0, W, W, 0,
      0, W, W, W,
      0, W, W, 0,
      0, 0, 0, 0,
    ],
  },

  [StructureTypes.FARM]: {
    type: StructureTypes.FARM,
    cost: 10,
    displayName: 'Farm',
    size: [ 3, 3 ],
    footprint: [
      W, W, W,
      W, 0, W,
      W, W, W,
    ],
  },

  [StructureTypes.HOUSE]: {
    type: StructureTypes.HOUSE,
    cost: 30,
    displayName: 'House',
    size: [ 5, 5 ],
    footprint: [
      0, 0, 0, 0, 0,
      0, W, W, W, 0,
      0, W, W, W, W,
      0, W, W, W, 0,
      0, 0, 0, 0, 0,
    ],
  },

  [StructureTypes.STOCKPILE]: {
    type: StructureTypes.STOCKPILE,
    cost: 10,
    displayName: 'Stockpile',
    size: [ 4, 4 ],
    footprint: [
      W, W, W, W,
      W, W, W, W,
      W, W, W, W,
      W, W, W, W,
    ],
  },

};

export default function createStructure(structureType, overrides) {
  return {
    ...structureBase,
    ...templates[structureType],
    ...overrides,
  };
};
