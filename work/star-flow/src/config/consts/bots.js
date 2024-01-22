const msPerDay = 24 * 60 * 60 * 1000;

export const dateRangeField = {
  from: {
    name: 'From',
    default: new Date(Date.now() - 7 * msPerDay),
  },
  to: {
    name: 'To',
    default: new Date(),
  },
};
