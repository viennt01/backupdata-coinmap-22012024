import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    BarSeries,
    CandlestickSeries,
    LineSeries,
    MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
    OHLCTooltip,
    MovingAverageTooltip,
    MACDTooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, macd } from "react-stockcharts/lib/indicator";
import { getMorePropsForChart } from "react-stockcharts/lib/interactive/utils";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
    FreeArrows,
    InteractiveText,
    LabelArrow,
    DrawingObjectSelector,
} from "react-stockcharts/lib/interactive";
import { head, last, toObject } from "react-stockcharts/lib/utils";

import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";

const macdAppearance = {
    stroke: {
        macd: "#FF0000",
        signal: "#00F300",
    },
    fill: {
        divergence: "#4682B4",
    },
};

class CandlestickChart extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onDrawCompleteChart1 = this.onDrawCompleteChart1.bind(this);
        this.onDrawCompleteChart3 = this.onDrawCompleteChart3.bind(this);
        this.handleSelection = this.handleSelection.bind(this);

        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);
        this.handleHover = this.handleHover.bind(this);

        this.saveCanvasNode = this.saveCanvasNode.bind(this);

        this.state = {
            enableInteractiveObject: true,
            arrows_1: [],
            arrows_3: [],
            textList_1: [],
            openArrowList_1: [],
        };
    }
    saveCanvasNode(node) {
        this.canvasNode = node;
    }
    componentDidMount() {
        document.addEventListener("keyup", this.onKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener("keyup", this.onKeyPress);
    }

    handleChoosePositionArrow(text, moreProps) {
        this.componentWillUnmount();
        const { id: chartId } = moreProps.chartConfig;

        this.setState({
            [`openArrowList_${chartId}`]: [
                ...this.state[`openArrowList_${chartId}`],
                text,
            ],
            enableInteractiveObject: false,
            chartId,
        });
    }
    handleSelection(interactives, moreProps, e) {
        const state = toObject(interactives, (each) => {
            return [`arrows_${each.chartId}`, each.objects];
        });
        this.setState(state);
    }
    onDrawCompleteChart1(arrows_1) {
        this.setState({
            enableInteractiveObject: false,
            arrows_1,
        });
    }
    onDrawComplete(textList, moreProps) {
        // this gets called on
        // 1. draw complete of drawing object
        // 2. drag complete of drawing object
        const { id: chartId } = moreProps.chartConfig;

        this.setState({
            enableInteractiveObject: true,
            [`textList_${chartId}`]: textList,
        });
    }
    onDrawCompleteArrow(openArrowList, moreProps) {
        // this gets called on
        // 1. draw complete of drawing object
        // 2. drag complete of drawing object
        const { id: chartId } = moreProps.chartConfig;

        this.setState({
            enableInteractiveObject: false,
            [`openArrowList_${chartId}`]: openArrowList,
        });
    }
    onDrawCompleteChart3(arrows_3) {
        // this gets called on
        // 1. draw complete of trendline
        // 2. drag complete of trendline
        console.log(arrows_3);
        this.setState({
            enableInteractiveObject: false,
            arrows_3,
        });
    }
    handleHover(hovering, arrow) {
        console.log(hovering, "handleHover");
        console.log(arrow.hovering, "handleHover");
    }
    onKeyPress(e) {
        const keyCode = e.which;
        console.log(keyCode);
        switch (keyCode) {
            case 46: {
                // DEL

                const arrows_1 = this.state.arrows_1.filter(
                    (each) => !each.selected
                );
                const arrows_3 = this.state.arrows_3.filter(
                    (each) => !each.selected
                );

                this.canvasNode.cancelDrag();
                this.setState({
                    arrows_1,
                    arrows_3,
                    textList_1,
                });
                break;
            }
            case 27: {
                // ESC
                this.node_1.terminate();
                this.node_3.terminate();
                this.canvasNode.cancelDrag();
                this.setState({
                    enableInteractiveObject: false,
                });
                break;
            }
            case 68: // D - Draw trendline
            case 69: {
                // E - Enable trendline
                this.setState({
                    enableInteractiveObject: true,
                });
                break;
            }
        }
    }
    render() {
        const ema26 = ema()
            .id(0)
            .options({ windowSize: 26 })
            .merge((d, c) => {
                d.ema26 = c;
            })
            .accessor((d) => d.ema26);

        const ema12 = ema()
            .id(1)
            .options({ windowSize: 12 })
            .merge((d, c) => {
                d.ema12 = c;
            })
            .accessor((d) => d.ema12);

        const macdCalculator = macd()
            .options({
                fast: 12,
                slow: 26,
                signal: 9,
            })
            .merge((d, c) => {
                d.macd = c;
            })
            .accessor((d) => d.macd);

        const { type, data: initialData, width, ratio } = this.props;

        const calculatedData = macdCalculator(ema12(ema26(initialData)));
        const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
            (d) => d.date
        );
        const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
            calculatedData
        );

        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length - 150)]);
        const xExtents = [start, end];

        return (
            <ChartCanvas
                ref={this.saveCanvasNode}
                height={600}
                width={width}
                ratio={ratio}
                margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
                type={type}
                seriesName="MSFT"
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={xExtents}
            >
                <Chart
                    id={1}
                    height={400}
                    yExtents={[
                        (d) => [d.high, d.low],
                        ema26.accessor(),
                        ema12.accessor(),
                    ]}
                    padding={{ top: 10, bottom: 20 }}
                    interactives={{arrows_1: this.state.arrows_1 }}
                >
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        showTicks={false}
                        outerTickSize={0}
                    />
                    <YAxis axisAt="right" orient="right" ticks={5} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")}
                    />

                    <CandlestickSeries />
                    <LineSeries
                        yAccessor={ema26.accessor()}
                        stroke={ema26.stroke()}
                    />
                    <LineSeries
                        yAccessor={ema12.accessor()}
                        stroke={ema12.stroke()}
                    />

                    <CurrentCoordinate
                        yAccessor={ema26.accessor()}
                        fill={ema26.stroke()}
                    />
                    <CurrentCoordinate
                        yAccessor={ema12.accessor()}
                        fill={ema12.stroke()}
                    />

                    <EdgeIndicator
                        itemType="last"
                        orient="right"
                        edgeAt="right"
                        yAccessor={(d) => d.close}
                        fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
                    />

                    <OHLCTooltip origin={[-40, 0]} />

                    <MovingAverageTooltip
                        onClick={(e) => console.log(e)}
                        origin={[-38, 15]}
                        options={[
                            {
                                yAccessor: ema26.accessor(),
                                type: ema26.type(),
                                stroke: ema26.stroke(),
                                windowSize: ema26.options().windowSize,
                            },
                            {
                                yAccessor: ema12.accessor(),
                                type: ema12.type(),
                                stroke: ema12.stroke(),
                                windowSize: ema12.options().windowSize,
                            },
                        ]}
                    />
                    <FreeArrows
                        ref={this.saveInteractiveNodes("FreeArrows", 1)}
                        enabled={this.state.enableInteractiveObject}
                        type="ARROW"
                        snap={false}
                        snapTo={(d) => [d.high, d.low]}
                        onStart={() => console.log("START")}
                        onComplete={this.onDrawCompleteChart1}
                        arrows={this.state.arrows_1}
                        isHover={this.handleHover}
                    />
                </Chart>
                <Chart
                    id={2}
                    height={150}
                    yExtents={[(d) => d.volume]}
                    origin={(w, h) => [0, h - 300]}
                >
                    <YAxis
                        axisAt="left"
                        orient="left"
                        ticks={5}
                        tickFormat={format(".2s")}
                    />

                    <MouseCoordinateY
                        at="left"
                        orient="left"
                        displayFormat={format(".4s")}
                    />

                    <BarSeries
                        yAccessor={(d) => d.volume}
                        fill={(d) => (d.close > d.open ? "#6BA583" : "#FF0000")}
                    />
                </Chart>
                <Chart
                    id={3}
                    height={150}
                    yExtents={macdCalculator.accessor()}
                    origin={(w, h) => [0, h - 150]}
                    padding={{ top: 10, bottom: 10 }}
                >
                    <XAxis axisAt="bottom" orient="bottom" />
                    <YAxis axisAt="right" orient="right" ticks={2} />

                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%Y-%m-%d")}
                    />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")}
                    />
                    <MACDSeries yAccessor={(d) => d.macd} {...macdAppearance} />
                    <MACDTooltip
                        origin={[-38, 15]}
                        yAccessor={(d) => d.macd}
                        options={macdCalculator.options()}
                        appearance={macdAppearance}
                    />
                </Chart>
                <CrossHairCursor />
                <DrawingObjectSelector
                    enabled={!this.state.enableInteractiveObject}
                    getInteractiveNodes={this.getInteractiveNodes}
                    drawingObjectMap={{
                        FreeArrows: "arrows",
                    }}
                    onSelect={this.handleSelection}
                />
            </ChartCanvas>
        );
    }
}

CandlestickChart.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandlestickChart.defaultProps = {
    type: "svg",
};

const CandleStickChartWithFreeArrows = fitWidth(CandlestickChart);

export default CandleStickChartWithFreeArrows;
