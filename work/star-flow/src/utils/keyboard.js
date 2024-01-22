/**
 * check key event is not composed
 * @param {KeyboardEvent} event keyboard event
 * @param {Array<String>} keys keyboard event
 */
export const isSingleKey = (event, keys) => {
  if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
    return false;
  }

  return keys.includes(event.code);
};
