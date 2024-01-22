const ENABLE_LOG = false;

export const cLog = (...args) => {
  if (!ENABLE_LOG) {
    return;
  }
};
