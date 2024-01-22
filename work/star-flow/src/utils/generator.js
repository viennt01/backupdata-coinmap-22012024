export const genSimpleID = () => {
  return '_' + Math.random().toString(16).slice(2);
};

export const generateSampleHeatmapData = (highPrice, lowPrice) => {
  const tickValue = 0.002;
  const baseVol = 1000000;
  const numOfHight = Math.random() * 500;
  const numOfLow = Math.random() * 500;

  const result = [];
  const shuoldHaveMaxVol = 100 - Math.floor(Math.random() * 30);

  let orderType = 'b';
  for (let i = numOfLow; i >= 1; i--) {
    const diff = tickValue * i;
    let vol = Math.random() * ((numOfLow - i) / numOfLow) * baseVol;

    if (i === shuoldHaveMaxVol) {
      vol = baseVol;
    }

    result.push([orderType, lowPrice - diff, vol]);
  }

  orderType = 's';
  for (let i = 1; i <= numOfHight; i++) {
    const diff = tickValue * i;
    let vol = Math.random() * ((numOfHight - i) / numOfHight) * baseVol;
    if (i === shuoldHaveMaxVol) {
      vol = baseVol;
    }

    result.push([orderType, highPrice + diff, vol]);
  }

  return result;
};

export const generateUUID = () => {
  let now = new Date().getTime();
  let performanceNow = (performance?.now() ?? 0) * 1000;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16;
    if (now > 0) {
      random = (now + random) % 16 | 0;
      now = Math.floor(now / 16);
    } else {
      random = (performanceNow + random) % 16 | 0;
      performanceNow = Math.floor(performanceNow / 16);
    }
    return (c == 'x' ? random : (random & 0x7) | 0x8).toString(16);
  });
};
