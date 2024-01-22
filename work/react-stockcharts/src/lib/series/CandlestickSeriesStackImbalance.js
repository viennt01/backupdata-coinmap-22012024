"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Collection = require("d3-collection");

var _d3Array = require("d3-array");

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

var CandlestickSeriesStackImbalance = function (_Component) {
	_inherits(CandlestickSeriesStackImbalance, _Component);

	function CandlestickSeriesStackImbalance(props) {
		_classCallCheck(this, CandlestickSeriesStackImbalance);

		var _this = _possibleConstructorReturn(this, (CandlestickSeriesStackImbalance.__proto__ || Object.getPrototypeOf(CandlestickSeriesStackImbalance)).call(this, props));

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(CandlestickSeriesStackImbalance, [{
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

	return CandlestickSeriesStackImbalance;
}(_react.Component);

CandlestickSeriesStackImbalance.propTypes = {
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

CandlestickSeriesStackImbalance.defaultProps = {
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
	clip: true,
	source: function source(d) {
		return d.close;
	},

};



function _drawOnCanvas(ctx, props, moreProps) {
	var formatInteger = format(",");
	// console.log("moreProps",moreProps.chartConfig.realYDomain)
	// console.log("props",props)
	// console.log("moreProps",moreProps)

	
	if (!moreProps.plotData[moreProps.plotData.length - 1].aggTrades) return;
	// if (moreProps.plotData.length >= 15 || !moreProps.plotData[moreProps.plotData.length - 1].aggTrades) return;
	var  width  = moreProps.width
	var opacity = props.opacity,
		candleStrokeWidth = props.candleStrokeWidth;
	var xScale = moreProps.xScale,
		yScale = moreProps.chartConfig.yScale,
		plotData = moreProps.plotData,
		xAccessor = moreProps.xAccessor;

	
	var array = []
		plotData.forEach(obj => {
		// if(obj.aggTrades && obj.aggTrades.length!=0 && (obj.aggTrades[obj.aggTrades.length-1].sumArrayStackImbalanceSell.length!=0 || obj.aggTrades[obj.aggTrades.length-1].sumArrayStackImbalanceBuy.length!=0)) { 
			array.push(obj)
			// }
		});	
	if(array.length !==0) {
		// var candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);
		var candleData = getCandleData(props, xAccessor, xScale, yScale, array);

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
			// if(d.candles_child.length !=0){
			// 	for(let num of d.candles_child) {

			// 		var {x, y, h, type, } = num.stackImbalance
			// 		ctx.fillStyle = type=="sell"?"yellow":"#3333FF"
			// 		// ctx.fillStyle = "yellow"

			// 		ctx.strokeStyle = "blue"
			// 		ctx.globalAlpha = 0.5
			// 		ctx.fillRect(x - 0.5, y, width, h);
			// 		ctx.fillRect(x - 0.5, y, width, h);
			// 	}
			
			// }
			
		

		});
	});
	} 	

	// var candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);
	// var wickNest = (0, _d3Collection.nest)().key(function (d) {
	// 	return d.wick.stroke;
	// }).entries(candleData);

	// wickNest.forEach(function (outer) {
	// 	var key = outer.key,
	// 		values = outer.values;

	// 	ctx.strokeStyle = key;
	// 	ctx.fillStyle = key;
	// 	values.forEach(function (each) {

	// 		var d = each.wick;
	// 		if(d.candles_child.length !=0){
	// 			for(let num of d.candles_child) {

	// 				var {x, y, h, type, } = num.stackImbalance
	// 				ctx.fillStyle = type=="sell"?"yellow":"#3333FF"
	// 				// ctx.fillStyle = "yellow"

	// 				ctx.strokeStyle = "blue"
	// 				ctx.globalAlpha = 0.5
	// 				ctx.fillRect(x - 0.5, y, width, h);
	// 				ctx.fillRect(x - 0.5, y, width, h);
	// 			}
			
	// 		}
			
		

	// 	});
	// });
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
	// var candles_child = [];

/// cat stackimbalance
	var source = props.source
	// var session =  [plotData];
	var session =  plotData;


	// var histogram2 = (0, _d3Array.histogram)()
	// // .domain(xScale.domain())
	// .value(source).thresholds(50);

	var histogram2 = (0, _d3Array.histogram)()
	// .domain(xScale.domain())
	.value(source);
	
	var values = histogram2(session);

	// console.log(values)
/// cat stackimbalance



	for (var i = 0; i < plotData.length; i++) {
		var candles_child = [];
		var d = plotData[i];
		if ((0, _utils.isDefined)(yAccessor(d).close)) {
			var x = Math.round(xScale(xAccessor(d)));
			var ohlc = yAccessor(d);
			var y = Math.round(yScale(Math.max(ohlc.open, ohlc.close)));
			var height = Math.round(Math.abs(yScale(ohlc.open) - yScale(ohlc.close)));

			// divide tradehistory in one candle		
				
			var priceArray = d.aggTrades
			if(priceArray && priceArray.length!=0 && (priceArray[priceArray.length-1].sumArrayStackImbalanceSell.length!=0 || priceArray[priceArray.length-1].sumArrayStackImbalanceBuy.length!=0)) {
			// if(priceArray[priceArray.length-1].sumArrayStackImbalanceSell || priceArray[priceArray.length-1].sumArrayStackImbalanceBuy) {

				var {sumArrayStackImbalanceSell, sumArrayStackImbalanceBuy } = priceArray[priceArray.length-1]
					if(sumArrayStackImbalanceSell.length!=0){
						for(let num of sumArrayStackImbalanceSell){
							candles_child.push({
								// type: "line"
								x: x - offset,
								y: y,
								stackImbalance: {
									x: x,
									y: Math.round(yScale(num[num.length-1])),
									// y: Math.round(yScale(num[0])),
									width:width,
									// h: Math.round(yScale(num[num.length-1])) - Math.round(yScale(num[0])),
									h: Math.round(yScale(num[0])) - Math.round(yScale(num[num.length-1])),

									type:"sell" 
								},
							});
						}
					}
					if(sumArrayStackImbalanceBuy.length!=0){
						for(let num of sumArrayStackImbalanceBuy){
							candles_child.push({
								// type: "line"
								x: x - offset,
								y: y,
								stackImbalance: {
									x: x,
									y: Math.round(yScale(num[num.length-1])),
									// y: Math.round(yScale(num[0])),
									width:width,
									// h: Math.round(yScale(num[num.length-1])) - Math.round(yScale(num[0])),
									h:  Math.round(yScale(num[0])) - Math.round(yScale(num[num.length-1])) ,
									type:"buy" 
								},
							});
						}
					}

				// }
			}else{
				// candles_child.push({
				// 	// type: "line"
				// 	x: x - offset,
				// 	y: y,
				// 	orderflow: {
				// 		x: x,
				// 		sumKL_Seller: 0,
				// 		sumKL_Buyer:  0,
				// 		ySB: y,
				// 		color_sumKL_Seller: false,
				// 		color_sumKL_Buyer: false,
				// 		sum: 0,
				// 		delta: 0,
				// 		StackImbalance_sell: 0,
				// 		StackImbalance_buy: 0,
				// 		// heightText:(height/priceArray.length).toFixed(0)
				// 	},
				// });
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
					candles_child: candles_child,
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

exports.default = CandlestickSeriesStackImbalance;
//# sourceMappingURL=CandlestickSeriesOrderflow.js.map