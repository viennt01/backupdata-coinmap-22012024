export const localStore = {
  get: (name) => {
    try {
      const value = localStorage.getItem(name);
      if (value) {
        return JSON.parse(value);
      }
      return undefined;
    } catch (e) {
      const value = localStorage.getItem(name);
      if (value) {
        return value;
      }
      return undefined;
    }
  },
  set: (name, value) => localStorage.setItem(name, value),
  remove: (name, callback) => {
    return new Promise((reslove) => {
      localStorage.removeItem(name);
      reslove();
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  },
};
