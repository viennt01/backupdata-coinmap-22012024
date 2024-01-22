"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Collection = require("d3-collection");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");
const { tickStep } = require("d3-array");
const { format } = require("d3-format");


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CandlestickSeriesOrderflow = function (_Component) {
	_inherits(CandlestickSeriesOrderflow, _Component);

	function CandlestickSeriesOrderflow(props) {
		_classCallCheck(this, CandlestickSeriesOrderflow);

		var _this = _possibleConstructorReturn(this, (CandlestickSeriesOrderflow.__proto__ || Object.getPrototypeOf(CandlestickSeriesOrderflow)).call(this, props));

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(CandlestickSeriesOrderflow, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			_drawOnCanvas(ctx, this.props, moreProps);
		}
	},
	{
		key: "render",
		value: function render() {
			var clip = this.props.clip;

			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: clip,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}]);

	return CandlestickSeriesOrderflow;
}(_react.Component);

CandlestickSeriesOrderflow.propTypes = {
	className: _propTypes2.default.string,
	wickClassName: _propTypes2.default.string,
	candleClassName: _propTypes2.default.string,
	widthRatio: _propTypes2.default.number,
	width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	classNames: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	fill: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	stroke: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	wickStroke: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string]),
	yAccessor: _propTypes2.default.func,
	clip: _propTypes2.default.bool
};

CandlestickSeriesOrderflow.defaultProps = {
	className: "react-stockcharts-candlestick",
	wickClassName: "react-stockcharts-candlestick-wick",
	candleClassName: "react-stockcharts-candlestick-candle",
	yAccessor: function yAccessor(d) {
		return { open: d.open, high: d.high, low: d.low, close: d.close, aggTrades: d.aggTrades };
	},
	classNames: function classNames(d) {
		return d.close > d.open ? "up" : "down";
	},
	width: _utils.plotDataLengthBarWidth,
	wickStroke: "#000000",
	// wickStroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	fill: function fill(d) {
		return d.close > d.open ? "#6BA583" : "#FF0000";
	},
	// stroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
	stroke: "#000000",
	candleStrokeWidth: 0.5,
	// stroke: "none",
	widthRatio: 0.8,
	opacity: 0.5,
	clip: true
};



function _drawOnCanvas(ctx, props, moreProps) {
	var formatInteger = format(",");

	if (moreProps.plotData.length >= 15 || !moreProps.plotData[moreProps.plotData.length - 1].aggTrades) return;
	var opacity = props.opacity,
		candleStrokeWidth = props.candleStrokeWidth;
	var xScale = moreProps.xScale,
		yScale = moreProps.chartConfig.yScale,
		plotData = moreProps.plotData,
		xAccessor = moreProps.xAccessor;

	var candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);
	var wickNest = (0, _d3Collection.nest)().key(function (d) {
		return d.wick.stroke;
	}).entries(candleData);

	wickNest.forEach(function (outer) {
		var key = outer.key,
			values = outer.values;

		ctx.strokeStyle = key;
		ctx.fillStyle = key;
		values.forEach(function (each) {

			var d = each.wick;
			// ctx.fillRect(d.x - 0.5, d.y1, 1, d.y2 - d.y1);
			// ctx.fillRect(d.x - 0.5, d.y3, 1, d.y4 - d.y3);
		
			// console.log("1",d.candlesChild)
// sum and delta in last object			
			if( d.candlesChild[d.candlesChild.length-1]){
			var {sum, delta, StackImbalance_buy,StackImbalance_sell, heightText} = d.candlesChild[d.candlesChild.length-1].orderflow
			}
			// console.log("2",sum, delta, StackImbalance_buy, StackImbalance_sell )
			// console.log(heightText)
			if (d.candlesChild) {
				ctx.font = ` bold 10px sans-serif`
				// ctx.font = ctx.font.replace(/\d+px/, `${heightText}px`);
				ctx.lineWidth = 20
				// sum row volume	
				for (const num of d.candlesChild) {
					if (num.orderflow.color_sumKL_Seller == true) {
						ctx.fillStyle = "yellow"
						ctx.strokeStyle = "blue"
						ctx.textAlign = "right"
						ctx.fillText(String(formatInteger(num.orderflow.sumKL_Seller)), num.orderflow.x -2, num.orderflow.ySB)
					} else {
						ctx.fillStyle = "white"
						ctx.strokeStyle = "blue"
						ctx.textAlign = "right"
						ctx.fillText(String(formatInteger(num.orderflow.sumKL_Seller)), num.orderflow.x -2, num.orderflow.ySB)
					}

					if (num.orderflow.color_sumKL_Buyer == true) {
						ctx.fillStyle = "#3333FF"
						ctx.strokeStyle = "red"
						ctx.textAlign = "left"
						ctx.fillText(String(formatInteger(num.orderflow.sumKL_Buyer)), num.orderflow.x +2, num.orderflow.ySB)
					} else {
						ctx.fillStyle = "white"
						ctx.strokeStyle = "red"
						ctx.textAlign = "left"
						ctx.fillText(String(formatInteger(num.orderflow.sumKL_Buyer)), num.orderflow.x +2, num.orderflow.ySB)
					}
				}
				// ctx.font = "bold 15px sans-serif"
				// 	sum total volume			
				ctx.fillStyle = "white"
				ctx.strokeStyle = "red"
				ctx.textAlign = "center"
				ctx.fillText(formatInteger(sum), d.x - 0.5, d.y1 - 30)
				// delta			
				if (delta < 0) {
					ctx.fillStyle = "red"
					ctx.strokeStyle = "blue"
					ctx.textAlign = "center"
					ctx.fillText(formatInteger(delta), d.x - 0.5, d.y4 + 30)
				} else {
					ctx.fillStyle = "#00FF00"
					ctx.strokeStyle = "red"
					ctx.textAlign = "center"
					ctx.fillText(formatInteger(delta), d.x - 0.5, d.y4 + 30)
				}
				// stack imbalance sell
				ctx.fillStyle = "yellow"
				ctx.strokeStyle = "blue"
				ctx.textAlign = "right"
				ctx.fillText(StackImbalance_sell, d.x-5, d.y1-10)

				// stack imbalance buy
				ctx.fillStyle = "#3333FF"
				ctx.strokeStyle = "red"
				ctx.textAlign = "left"
				ctx.fillText(StackImbalance_buy, d.x+5, d.y1-10)
			}
		});
	});
}

function getCandleData(props, xAccessor, xScale, yScale, plotData) {
	var wickStrokeProp = props.wickStroke;

	var wickStroke = (0, _utils.functor)(wickStrokeProp);

	var classNames = props.classNames,
		fillProp = props.fill,
		strokeProp = props.stroke,
		yAccessor = props.yAccessor;

	var className = (0, _utils.functor)(classNames);

	var fill = (0, _utils.functor)(fillProp);
	var stroke = (0, _utils.functor)(strokeProp);

	var widthFunctor = (0, _utils.functor)(props.width);
	var width = widthFunctor(props, {
		xScale: xScale,
		xAccessor: xAccessor,
		plotData: plotData
	});

	var trueOffset = 0.5 * width;
	var offset = trueOffset > 0.7 ? Math.round(trueOffset) : Math.floor(trueOffset);

	// eslint-disable-next-line prefer-const
	var candles = [];

	for (var i = 0; i < plotData.length; i++) {
		var candlesChild = [];
		var d = plotData[i];
		if ((0, _utils.isDefined)(yAccessor(d).close)) {
			var x = Math.round(xScale(xAccessor(d)));
			var ohlc = yAccessor(d);
			var y = Math.round(yScale(Math.max(ohlc.open, ohlc.close)));
			var height = Math.round(Math.abs(yScale(ohlc.open) - yScale(ohlc.close)));

			// divide tradehistory in one candle		
			var priceArray = d.aggTrades
			console.log('priceArray', priceArray);
			if(priceArray) {
				for (const num of priceArray) {
					candlesChild.push({
						// type: "line"
						x: x - offset,
						y: y,
						orderflow: {
							x: x,
							sumKL_Seller: num.sumKL_Seller?num.sumKL_Seller:0,
							sumKL_Buyer:  num.sumKL_Buyer?num.sumKL_Buyer:0,
							ySB: Math.round(yScale(num.loop2 - num.tick / 2))?Math.round(yScale(num.loop2 - num.tick / 2)):y,
							color_sumKL_Seller: num.color_sumKL_Seller?num.color_sumKL_Seller:false,
							color_sumKL_Buyer: num.color_sumKL_Buyer?num.color_sumKL_Buyer:false,
							sum: (num.TsumKL_Seller + num.TsumKL_Buyer).toFixed(0)?(num.TsumKL_Seller + num.TsumKL_Buyer).toFixed(0):0,
							delta: (num.TsumKL_Buyer - num.TsumKL_Seller).toFixed(0)?(num.TsumKL_Buyer - num.TsumKL_Seller).toFixed(0):0,
							StackImbalance_sell: num.StackImbalance_sell?num.StackImbalance_sell:0,
							StackImbalance_buy: num.StackImbalance_buy?num.StackImbalance_buy:0,
							// heightText:(height/priceArray.length).toFixed(0)
						},
					});
				}
			}else{
				candlesChild.push({
					// type: "line"
					x: x - offset,
					y: y,
					orderflow: {
						x: x,
						sumKL_Seller: 0,
						sumKL_Buyer:  0,
						ySB: y,
						color_sumKL_Seller: false,
						color_sumKL_Buyer: false,
						sum: 0,
						delta: 0,
						StackImbalance_sell: 0,
						StackImbalance_buy: 0,
						// heightText:(height/priceArray.length).toFixed(0)
					},
				});
			}
				
// divide tradehistory in one candle			

// candlestick				
			candles.push({
				// type: "line"
				x: x - offset,
				y: y,
				wick: {
					stroke: wickStroke(ohlc),
					x: x,
					y1: Math.round(yScale(ohlc.high)),
					y2: y,
					y3: y + height, // Math.round(yScale(Math.min(ohlc.open, ohlc.close))),
					y4: Math.round(yScale(ohlc.low)),
					candlesChild,
				},
				height: height,
				width: offset * 2,
				className: className(ohlc),
				fill: fill(ohlc),
				stroke: stroke(ohlc),
				direction: ohlc.close - ohlc.open
			});
// candlestick				

		}
	}
	return candles;
}

exports.default = CandlestickSeriesOrderflow;
//# sourceMappingURL=CandlestickSeriesOrderflow.js.map