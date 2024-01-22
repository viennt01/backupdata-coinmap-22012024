export function generateGroupId(drawingType, id, groupIndex, itemIndex) {
  return {
    drawingType,
    id,
    groupIndex,
    itemIndex,
  };
}

export function indexGroupId(groupId, itemIndex) {
  return {
    ...groupId,
    itemIndex,
  };
}
