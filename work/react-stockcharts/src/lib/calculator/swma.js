

import { slidingWindow } from "../utils";
import { SWMA as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	let options = defaultOptions;

	function calculator(data) {
    const { windowSize, sourcePath, source } = options;

    const average = slidingWindow()
      .windowSize(windowSize)
      .sourcePath(sourcePath)
      .source(source)
      .accumulator((values) => {
        const len = values.length;
        let sumSrcWeight = 0,
          sumWeight = 0;
        for (let i = -1; ++i < len; ) {
          let weight = len / 2;
          if (i < len / 2) weight = i + 1;
          if (i > len / 2) weight = len - i;
          sumSrcWeight += values[i] * weight;
          sumWeight += weight;
        }
        return sumSrcWeight / sumWeight;
      });

    return average(data);
  }
	calculator.undefinedLength = function() {
		const { windowSize } = options;

		return windowSize - 1;
	};
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
