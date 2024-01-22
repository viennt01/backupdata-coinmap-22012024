import { DRAW_TOOLS } from '@/config/consts/drawTool';
import {
  actEndDraw,
  actUpdateChartToSever,
  actSelectDraw,
  actUpdateDraw,
} from '@/redux/actions/setting';
import { toTimeIndexMap } from '@/utils/datetime';
import { head, last } from '@coinmap/react-stockcharts/lib/utils';
import {
  FibonacciRetracement,
  TrendLine,
  Path,
  InteractiveText,
  Triangle,
  Rectangle,
  ArrowMarker,
  OnePointLine,
  Callout,
  FreeArrows,
  LongPosition,
  ShortPosition,
} from '@coinmap/react-stockcharts/lib/interactive';
import InteractiveTextModal from '../components/InteractiveTextModal';
import { DEFAULT_SETTINGS } from '@/config/consts/drawSettings/common';
import { DrawSettingModalWithData } from '@/components/DrawSettings/DrawSettingModalWithData';

export function handleDeleteDraw({ drawType, item: selectedItem }) {
  const { dispatch, draws, chartId } = this.props;

  // filter item in state
  const filteredData = this.state.draws[drawType].filter(
    (item) => item.id !== selectedItem.id
  );
  this.setState({
    draws: {
      ...this.state.draws,
      [drawType]: filteredData,
    },
  });

  // filter item in redux
  const drawData = draws[drawType]?.data || {};
  const items = drawData.items.filter((item) => item.id !== selectedItem.id);
  dispatch(
    actEndDraw(drawType, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}

export function handleToggleLock({ drawType, item: selectedItem }) {
  const { dispatch, draws, chartId } = this.props;
  console.log('{ drawType, item: selectedItem }', {
    drawType,
    item: selectedItem,
  });

  // filter item in state
  const filteredData = this.state.draws[drawType].map((item) => {
    if (item.id !== selectedItem.id) {
      return item;
    }

    return {
      ...item,
      locked: !item.locked,
    };
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [drawType]: filteredData,
    },
  });

  // filter item in redux
  const drawData = draws[drawType]?.data || {};
  const items = drawData.items.map((item) => {
    if (item.id !== selectedItem.id) {
      return item;
    }

    return {
      ...item,
      locked: !item.locked,
    };
  });
  dispatch(
    actEndDraw(drawType, chartId, {
      ...drawData,
      items,
    })
  );
}

export function handleShowSettingModal({ drawType }) {
  const { dispatch, chartId } = this.props;
  dispatch(actUpdateDraw(drawType, { showModal: true }, chartId));
}

export function getShowableDraws(data, interval) {
  const timeIndexMap = toTimeIndexMap(data);
  const lastCandle = last(data);
  const firstCandle = head(data);

  const retracements = this.fibo_getShowables(
    timeIndexMap,
    interval,
    lastCandle
  );
  const trendLines = this.trendLine_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const paths = this.path_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const texts = this.text_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const triangles = this.triangle_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const rectangles = this.rectangle_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const verticalLines = this.verticalLine_getShowables(
    timeIndexMap,
    interval,
    lastCandle
  );
  const horizontalRays = this.horizontalRay_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const horizontalLines = this.horizontalLine_getShowables(
    timeIndexMap,
    interval,
    lastCandle
  );
  const arrowMarkers = this.arrowMarker_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const extendedLines = this.extendedLine_getShowables(
    timeIndexMap,
    interval,
    lastCandle
  );
  const callouts = this.callout_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const arrow = this.arrow_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const longPositions = this.longPosition_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );
  const shortPositions = this.shortPosition_getShowables(
    timeIndexMap,
    interval,
    lastCandle,
    firstCandle
  );

  const stateDraws = {
    [DRAW_TOOLS.fibonacci_retracement.type]: retracements,
    [DRAW_TOOLS.trend_line.type]: trendLines,
    [DRAW_TOOLS.path.type]: paths,
    [DRAW_TOOLS.text.type]: texts,
    [DRAW_TOOLS.triangle.type]: triangles,
    [DRAW_TOOLS.rectangle.type]: rectangles,
    [DRAW_TOOLS.extended_line.type]: extendedLines,
    [DRAW_TOOLS.arrow_marker.type]: arrowMarkers,
    [DRAW_TOOLS.vertical_line.type]: verticalLines,
    [DRAW_TOOLS.horizontal_ray.type]: horizontalRays,
    [DRAW_TOOLS.horizontal_line.type]: horizontalLines,
    [DRAW_TOOLS.callout.type]: callouts,
    [DRAW_TOOLS.arrow.type]: arrow,
    [DRAW_TOOLS.long_position.type]: longPositions,
    [DRAW_TOOLS.short_position.type]: shortPositions,
  };

  return stateDraws;
}

export function handleSelection(interactives) {
  const { dispatch, chartId } = this.props;
  if (Array.isArray(interactives)) {
    let hoveringItem = null;
    let selectedItem = null;
    for (let i = 0; i < interactives.length; i++) {
      const drawData = interactives[i];
      if (!Array.isArray(drawData.objects)) {
        continue;
      }

      hoveringItem = drawData.objects.find((item) => item.hovering);
      if (hoveringItem) {
        break;
      }
      if (!selectedItem) {
        selectedItem = drawData.objects.find((item) => item.selected);
      }
    }

    dispatch(actSelectDraw(chartId, [hoveringItem?.id || selectedItem?.id]));
  }
}

export function renderChartDraws({ tickFormat, timeDisplayFormat }) {
  const { draws } = this.state;
  const { chartId, sectionRef, isFullScreen } = this.props;

  const modalContainer = isFullScreen ? sectionRef?.current : null;

  const chartDraws = Object.keys(draws || {}).map((key) => {
    const drawSettings = this.props.draws; // draws of symbol

    switch (key) {
      case DRAW_TOOLS.fibonacci_retracement.type:
        return (
          <FibonacciRetracement
            key={key}
            ref={this.saveInteractiveNodes(
              DRAW_TOOLS.fibonacci_retracement.type,
              1
            )}
            enabled={
              drawSettings.enable === DRAW_TOOLS.fibonacci_retracement.type
            }
            retracements={draws[DRAW_TOOLS.fibonacci_retracement.type] || []}
            onComplete={this.onFibComplete}
            type="BOUND"
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              ...FibonacciRetracement.defaultProps.appearance,
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              nsEdgeFill: '#FFFF00',
              edgeStrokeWidth: 1,
              r: 3,
            }}
          />
        );

      case DRAW_TOOLS.trend_line.type:
        return (
          <TrendLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.trend_line.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.trend_line.type}
            type="LINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.trendLine_onComplete}
            trends={draws[DRAW_TOOLS.trend_line.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.text.type:
        return (
          <>
            <InteractiveText
              key={key}
              ref={this.saveInteractiveNodes(DRAW_TOOLS.text.type, 1)}
              enabled={drawSettings.enable === DRAW_TOOLS.text.type}
              text="Your text..."
              snap={false}
              snapTo={(d) => [d.high, d.low]}
              onComplete={this.text_onComplete}
              onDoubleClick={this.text_onDoubleClick}
              textComplete={this.text_handleChoosePosition}
              textList={draws[DRAW_TOOLS.text.type]}
              appearance={{
                ...InteractiveText.defaultProps.appearance,
                textFill: '#ffffff',
                fontSize: 16,
              }}
              onSelect={(...props) => {
                console.log('onSelect', props);
              }}
            />
            <InteractiveTextModal
              key={`${key}_modal`}
              showModal={drawSettings[key]?.showModal}
              chartId={chartId}
              onClose={this.text_handleCloseModal}
              onSave={this.text_onSave}
              container={modalContainer}
              drawItems={
                this.props.draws[DRAW_TOOLS.text.type]?.data.items ?? []
              }
              drawType={DRAW_TOOLS.text.type}
              updateDrawsState={this.text_updateDrawsState}
            />
          </>
        );

      case DRAW_TOOLS.path.type:
        return (
          <Path
            key={key}
            ref={this.saveInteractiveNodes(key, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.path.type}
            type="LINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.path_onComplete}
            trends={draws[key]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.triangle.type:
        return (
          <Triangle
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.triangle.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.triangle.type}
            type="LINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.triangle_onComplete}
            trends={draws[DRAW_TOOLS.triangle.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.rectangle.type:
        return (
          <Rectangle
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.rectangle.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.rectangle.type}
            type="LINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.rectangle_onComplete}
            trends={draws[DRAW_TOOLS.rectangle.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.vertical_line.type:
        return (
          <OnePointLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.vertical_line.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.vertical_line.type}
            type="XLINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.verticalLine_onComplete}
            trends={draws[DRAW_TOOLS.vertical_line.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.horizontal_ray.type:
        return (
          <OnePointLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.horizontal_ray.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.horizontal_ray.type}
            type="horizontalRay"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.horizontalRay_onComplete}
            trends={draws[DRAW_TOOLS.horizontal_ray.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.horizontal_line.type:
        return (
          <OnePointLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.horizontal_line.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.horizontal_line.type}
            type="horizontalXline"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.horizontalXLine_onComplete}
            trends={draws[DRAW_TOOLS.horizontal_line.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.arrow_marker.type:
        return (
          <ArrowMarker
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.arrow_marker.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.arrow_marker.type}
            type="LINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.arrowMarker_onComplete}
            trends={draws[DRAW_TOOLS.arrow_marker.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.extended_line.type:
        return (
          <TrendLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.extended_line.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.extended_line.type}
            type="XLINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.extendedLine_onComplete}
            trends={draws[DRAW_TOOLS.extended_line.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.callout.type:
        return (
          <>
            <Callout
              key={key}
              ref={this.saveInteractiveNodes(DRAW_TOOLS.callout.type, 1)}
              enabled={drawSettings.enable === DRAW_TOOLS.callout.type}
              type="LINE"
              snap={false}
              snapTo={(d) => [d.high, d.low]}
              onStart={() => console.log('START')}
              onComplete={this.callout_onComplete}
              onDoubleClick={this.callout_onDoubleClick}
              trends={draws[DRAW_TOOLS.callout.type]}
              textCallout={this.callout_textCallout}
              currentPositionStroke="#FFFFFF"
              currentPositionStrokeWidth={1}
              currentPositionRadius={8}
              appearance={{
                stroke: '#00d5ff',
                strokeWidth: 0,
                strokeOpacity: 1,
                fillOpacity: 1,
                fill: '#00d5ff',
                fontFill: '#FFFFFF',
                edgeStroke: '#FF00FF',
                edgeFill: '#FFFFFF',
                edgeStrokeWidth: 1,
                r: 5,
              }}
              onSelect={(...props) => {
                console.log('onSelect', props);
              }}
            />
            <InteractiveTextModal
              key={`${key}_modal`}
              showModal={drawSettings[key]?.showModal}
              chartId={chartId}
              onClose={this.callout_handleCloseModal}
              onSave={this.callout_onSave}
              container={modalContainer}
              drawType={DRAW_TOOLS.callout.type}
              drawItems={
                this.props.draws[DRAW_TOOLS.callout.type]?.data.items ?? []
              }
              updateDrawsState={this.callout_updateDrawsState}
            />
          </>
        );

      case DRAW_TOOLS.extended_line.type:
        return (
          <TrendLine
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.extended_line.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.extended_line.type}
            type="XLINE"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.extendedLine_onComplete}
            trends={draws[DRAW_TOOLS.extended_line.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.arrow.type:
        return (
          <FreeArrows
            key={key}
            ref={this.saveInteractiveNodes(DRAW_TOOLS.arrow.type, 1)}
            enabled={drawSettings.enable === DRAW_TOOLS.arrow.type}
            type="ARROW"
            snap={false}
            snapTo={(d) => [d.high, d.low]}
            onStart={() => console.log('START')}
            onComplete={this.arrow_onComplete}
            arrows={draws[DRAW_TOOLS.arrow.type]}
            currentPositionStroke="#FFFFFF"
            currentPositionStrokeWidth={1}
            currentPositionRadius={8}
            appearance={{
              stroke: '#00d5ff',
              strokeWidth: 0,
              strokeOpacity: 1,
              fontFill: '#FFFFFF',
              edgeStroke: '#FF00FF',
              edgeFill: '#FFFFFF',
              edgeStrokeWidth: 1,
              r: 5,
            }}
            onSelect={(...props) => {
              console.log('onSelect', props);
            }}
          />
        );

      case DRAW_TOOLS.long_position.type:
        return (
          <>
            <LongPosition
              key={key}
              ref={this.saveInteractiveNodes(DRAW_TOOLS.long_position.type, 1)}
              enabled={drawSettings.enable === DRAW_TOOLS.long_position.type}
              snap={false}
              snapTo={(d) => [d.high, d.low]}
              onStart={() => console.log('START')}
              onComplete={this.longPosition_onComplete}
              trends={draws[DRAW_TOOLS.long_position.type]}
              currentPositionStroke="#FFFFFF"
              currentPositionStrokeWidth={1}
              currentPositionRadius={8}
              appearance={
                DEFAULT_SETTINGS[DRAW_TOOLS.long_position.type].appearance
              }
              tickFormat={tickFormat}
              timeDisplayFormat={timeDisplayFormat}
              onSelect={(...props) => {
                console.log('onSelect', props);
              }}
              onDoubleClick={() =>
                this.handleShowSettingModal({
                  drawType: DRAW_TOOLS.long_position.type,
                })
              }
            />
            <DrawSettingModalWithData
              key={key + '_modal'}
              modalContainer={sectionRef.current}
              show={drawSettings[key]?.showModal}
              chartId={chartId}
              drawType={DRAW_TOOLS.long_position.type}
              draws={draws[DRAW_TOOLS.long_position.type]}
            />
          </>
        );

      case DRAW_TOOLS.short_position.type:
        return (
          <>
            <ShortPosition
              key={key}
              ref={this.saveInteractiveNodes(DRAW_TOOLS.short_position.type, 1)}
              enabled={drawSettings.enable === DRAW_TOOLS.short_position.type}
              snap={false}
              snapTo={(d) => [d.high, d.low]}
              onStart={() => console.log('START')}
              onComplete={this.shortPosition_onComplete}
              trends={draws[DRAW_TOOLS.short_position.type]}
              currentPositionStroke="#FFFFFF"
              currentPositionStrokeWidth={1}
              currentPositionRadius={8}
              appearance={
                DEFAULT_SETTINGS[DRAW_TOOLS.short_position.type].appearance
              }
              tickFormat={tickFormat}
              timeDisplayFormat={timeDisplayFormat}
              onSelect={(...props) => {
                console.log('onSelect', props);
              }}
              onDoubleClick={() =>
                this.handleShowSettingModal({
                  drawType: DRAW_TOOLS.short_position.type,
                })
              }
            />
            <DrawSettingModalWithData
              key={key + '_modal'}
              modalContainer={sectionRef.current}
              show={drawSettings[key]?.showModal}
              chartId={chartId}
              drawType={DRAW_TOOLS.short_position.type}
              draws={draws[DRAW_TOOLS.short_position.type]}
            />
          </>
        );
      default:
        return null;
    }
  });

  return chartDraws;
}
