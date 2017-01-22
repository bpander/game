import { WALKABLE, BUILDABLE } from 'constants/TerrainTypes';


const structure = {
  position: [ 0, 0 ],
  size: [ 2, 2 ],
  footprint: [
    0,        WALKABLE,
    WALKABLE, WALKABLE,
  ],
};
