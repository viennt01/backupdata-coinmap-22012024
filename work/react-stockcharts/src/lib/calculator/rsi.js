

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/relativeStrengthIndex.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { mean } from "d3-array";

import { isDefined, last, slidingWindow, path } from "../utils";
import { RSI as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	let options = defaultOptions;

	function calculator(data) {
		const { windowSize, sourcePath, source } = options;

		const sourceFunc = source || path(sourcePath);
		const rsiAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.skipInitial(1)
			.accumulator((values) => {
				const avgGain = mean(values, (each) => each.gain);
				const avgLoss = mean(values, (each) => each.loss);
				if (avgLoss === 0) return 100;
				if (avgGain === 0) return 0;
				return 100 - (100 / (1 + avgGain / avgLoss));
			});

		const gainsAndLossesCalculator = slidingWindow()
			.windowSize(2)
			.undefinedValue(() => [0, 0])
			.accumulator(tuple => {
				const prev = tuple[0];
				const now = tuple[1];
				const change = sourceFunc(now) - sourceFunc(prev);
				return {
					gain: Math.max(change, 0),
					loss: Math.abs(Math.min(change, 0)),
				};
			});

		const gainsAndLosses = gainsAndLossesCalculator(data);

		const rsiData = rsiAlgorithm(gainsAndLosses);

		return rsiData;
	}
	calculator.undefinedLength = function () {
		const { windowSize } = options;

		return windowSize - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
