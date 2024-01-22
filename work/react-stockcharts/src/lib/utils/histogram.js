/* eslint-disable prefer-const */

/**
 * D3 histogram with improved range function
 * Origin: path/to/source Ex: d3-array/histogram.ts
 * Error: Range return array of number with float point number
 * Solution: use toPrecision to skip float point in range function
 */

import { slice, bisect } from "d3-array";

const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

const constant = function(x) {
  return function() {
    return x;
  }; 
}

const extent = function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}

const identity = function(x) {
  return x;
}

const tickStep = function tickStep(start, stop, count) {
  const step0 = Math.abs(stop - start) / Math.max(0, count);
  let step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10));
  const error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

const range = function(start, stop, step) {
  let numberStart = 0;
  let numberStep = 0;
  if (start && step) {
    const stringStart = String(start);
    const stringStep = String(step);
    numberStart = stringStart.split(".")?.[0]?.length ?? 0  
    numberStep = stringStep.split(".")?.[1]?.length ?? 0
  }
  const totalNumber = numberStep + numberStart;

  (start = +start),
    (stop = +stop),
    (step =
      (n = arguments.length) < 2
        ? ((stop = start), (start = 0), 1)
        : n < 3
        ? 1
        : +step);
  let i = -1,
    n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
    range = new Array(n);

  while (++i < n) {
    range[i] = Number((start + i * step).toPrecision(totalNumber));
  }
  return range;
};

export default function() {
  let value = identity,
    domain = extent,
    threshold = function(values) {
      return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
    };

  function histogram(data) {
    let i,
      n = data.length,
      x,
      values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    let xz = domain(values),
      x0 = xz[0],
      x1 = xz[1],
      tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    let m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    let bins = new Array(m + 1),
      bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisect(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length
      ? ((value = typeof _ === "function" ? _ : constant(_)), histogram)
      : value;
  };

  histogram.domain = function(_) {
    return arguments.length
      ? ((domain = typeof _ === "function" ? _ : constant([_[0], _[1]])),
        histogram)
      : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length
      ? ((threshold =
          typeof _ === "function"
            ? _
            : Array.isArray(_)
            ? constant(slice.call(_))
            : constant(_)),
        histogram)
      : threshold;
  };

  return histogram;
}
