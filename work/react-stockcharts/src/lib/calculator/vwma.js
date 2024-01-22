

import { sum } from "d3-array";

import { slidingWindow, path } from "../utils";
import { VWMA as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	let options = defaultOptions;

	function calculator(data)    {
		const { windowSize, sourcePath, volumePath, source, skipInitial } = options;

		const sourceFunc = source || path(sourcePath);
		const volumeFunc = path(volumePath);

		const average = slidingWindow()
      .windowSize(windowSize)
			.skipInitial(skipInitial)
      .accumulator((values) => {
        const sumSrcVol = sum(values, (v) => sourceFunc(v) * volumeFunc(v));
				const sumVol = sum(values, (v) => volumeFunc(v));
        return sumSrcVol / sumVol;
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
