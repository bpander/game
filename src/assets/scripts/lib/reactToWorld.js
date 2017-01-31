import * as StructureTypes from 'constants/StructureTypes';


const workOnTask = (entity, state) => {
  switch (entity.task) {

  }
};

export default function reactToWorld(entity, state, ms) {
  if (entity.task) {
    workOnTask(entity, state, ms);
    return;
  }
  const { structures } = state;
  const structure = structures.find(structure => structure.uuid === entity.structure);
  if (!structure) {
    return;
  }
  switch (structure.type) {
    case StructureTypes.POTATO_PLANTS:
      break;
  }
};
