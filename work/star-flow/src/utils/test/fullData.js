export const testFullDataContinius = (fullData) => {
  let previous = fullData[0];
  const intervalSeconds = fullData[1].opentime - previous.opentime;
  for (let i = 1; i < fullData.length; i++) {
    const item = fullData[i];
    if (item.opentime - previous.opentime !== intervalSeconds) {
      return {
        intervalSeconds,
        diff: item.opentime - previous.opentime,
        i,
      };
    }

    previous = item;
  }

  return {};
};

export const checkIndexedData = (data) => {
  let previousDiff = null;
  for (let i = 1; i < data.length - 1; i++) {
    const item = data[i];
    const previousItem = data[i - 1];
    const diff = (item?.idx?.index || 0) - (previousItem?.idx?.index || 0);
    if (previousDiff !== null && previousDiff !== diff) {
      return {
        previousDiff,
        diff,
        i,
        item,
        previousItem,
        data,
      };
    }

    previousDiff = diff;
  }

  return null;
};
