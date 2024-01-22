function getConfig(indexC, count, chartId) {
  const height = 24;
  var config = {
    1: {
      position: [{ i: chartId, x: 0, y: 0, w: 24, h: height, minW: 4 }],
    },
    2: {
      position: [
        { i: chartId, x: 0, y: 0, w: 12, h: height, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height, minW: 4 },
      ],
    },
    3: {
      position: [
        { i: chartId, x: 0, y: 0, w: 24, h: height / 2, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 2, minW: 4 },
      ],
    },
    4: {
      position: [
        { i: chartId, x: 0, y: 0, w: 24, h: height / 3, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 3, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 3, minW: 4 },
      ],
    },
    5: {
      position: [
        { i: chartId, x: 0, y: 0, w: 8, h: height, minW: 4 },
        { i: chartId, x: 8, y: 0, w: 8, h: height, minW: 4 },
        { i: chartId, x: 16, y: 0, w: 8, h: height, minW: 4 },
      ],
    },
    6: {
      position: [
        { i: chartId, x: 0, y: 0, w: 12, h: height, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height / 2, minW: 4 },
      ],
    },
    7: {
      position: [
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 3) * height,
          w: 12,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 12,
          y: Math.floor(indexC / 3) * height,
          w: 12,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 3) * height + height / 2,
          w: 24,
          h: height / 2,
          minW: 4,
        },
      ],
    },
    8: {
      position: [
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 3) * height,
          w: 24,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 3) * height + height / 2,
          w: 12,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 12,
          y: Math.floor(indexC / 3) * height + height / 2,
          w: 12,
          h: height / 2,
          minW: 4,
        },
      ],
    },
    9: {
      position: [
        { i: chartId, x: 0, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height, minW: 4 },
      ],
    },
    10: {
      position: [
        { i: chartId, x: 0, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 12, h: height / 2, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height / 2, minW: 4 },
      ],
    },
    11: {
      position: [
        { i: chartId, x: 0, y: 0, w: 6, h: height, minW: 4 },
        { i: chartId, x: 6, y: 0, w: 6, h: height, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 6, h: height, minW: 4 },
        { i: chartId, x: 18, y: 0, w: 6, h: height, minW: 4 },
      ],
    },
    12: {
      position: [
        { i: chartId, x: 0, y: 0, w: 24, h: height / 4, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 4, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 4, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 24, h: height / 4, minW: 4 },
      ],
    },
    13: {
      position: [
        { i: chartId, x: 0, y: 0, w: 12, h: height / 3, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 12, h: height / 3, minW: 4 },
        { i: chartId, x: 0, y: 0, w: 12, h: height / 3, minW: 4 },
        { i: chartId, x: 12, y: 0, w: 12, h: height, minW: 4 },
      ],
    },
    14: {
      position: [
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 4) * height,
          w: 24,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 4) * height + height / 2,
          w: 8,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 8,
          y: Math.floor(indexC / 4) * height + height / 2,
          w: 8,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 16,
          y: Math.floor(indexC / 4) * height + height / 2,
          w: 8,
          h: height / 2,
          minW: 4,
        },
      ],
    },
    15: {
      position: [
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 4) * height,
          w: 12,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 12,
          y: Math.floor(indexC / 4) * height,
          w: 12,
          h: height / 2,
          minW: 4,
        },
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 4) * height + height / 2,
          w: 24,
          h: height / 4,
          minW: 4,
        },
        {
          i: chartId,
          x: 0,
          y: Math.floor(indexC / 4) * height + (3 / 4) * height,
          w: 24,
          h: height / 4,
          minW: 4,
        },
      ],
    },
  };
  const index = indexC % config[count].position.length;
  return config[count].position[index];
}

export const layoutsConfig = (charts, layoutId) => {
  return Object.keys(charts).map((key, index) => {
    const chartId = charts[key].chartId;
    return getConfig(index, layoutId, chartId);
  });
};
