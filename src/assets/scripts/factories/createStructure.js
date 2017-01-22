import { WALKABLE, BUILDABLE } from 'constants/TerrainTypes';
import * as StructureTypes from 'constants/StructureTypes';

const [ W, B ] = [ WALKABLE, BUILDABLE ];

const structureBase = {
  type: StructureTypes.NONE,
  position: [ 0, 0 ],
  size: [ 2, 2 ],
  footprint: [
    0, W,
    W, W,
  ],
};

const templates = {

  [StructureTypes.FARM]: {
    type: StructureTypes.FARM,
    size: [ 3, 3 ],
    footprint: [
      W, W, W,
      W, 0, W,
      W, W, W,
    ],
  },

  [StructureTypes.NURSERY]: {
    type: StructureTypes.NURSERY,
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
