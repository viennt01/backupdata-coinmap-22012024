/**
 * Init some properties to support path annotations for bot orders
 * This function will be called when at the end of Chart contructor
 */
export function initBotOrderAnnotation() {
  // When to show annotations
  this.orderPathAnnotaionWhen = (d) => {
    const { botSignals } = this.props;
    const signalsMap = botSignals?.signalsMap ?? {};

    return !!signalsMap[d.opentime];
  };

  // Prop for PathAnnotation component
  this.orderPathAnnotaionProps = {
    // toX1: leave default for start at current candle position

    // Find entry price and convert to Y
    toY1: ({ yScale, datum: candle }) => {
      const { botSignals } = this.props;
      const signalsMap = botSignals?.signalsMap ?? {};

      const signal = signalsMap[candle.opentime];
      if (!signal?.objPrice) return null;

      return yScale(signal?.objPrice?.value[0]);
    },

    // Find exit price and convert to Y
    toY2: ({ yScale, datum: candle }) => {
      const { botSignals } = this.props;
      const signalsMap = botSignals?.signalsMap ?? {};
      const signal = signalsMap[candle.opentime];
      if (!signal?.objPrice) return null;

      return yScale(signal?.objPrice?.value[1]);
    },

    // Find exit time and calculate exit candle index and convert to X
    toX2: ({ xScale, datum: candle, xAccessor }) => {
      const { botSignals } = this.props;
      const signalsMap = botSignals?.signalsMap ?? {};

      const signal = signalsMap[candle.opentime];
      if (!signal?.objPrice) return null;
      const startTime = signal.objPrice.time[0];
      const endTime = signal.objPrice.time[1];
      const endCandleOpenTime = Math.floor(
        signal.objPrice.time[1] -
          (signal.objPrice.time[1] % this.intervalMiliseconds)
      );
      const endCandleIndex = this.dataIndexMap[endCandleOpenTime];

      let endX = null;
      if (endCandleIndex && this.state.data[endCandleIndex]) {
        // candle found
        const endCandle = this.state.data[endCandleIndex];
        endX = xAccessor(endCandle);
      } else {
        // candle not found, calculate base on interval
        const startIndex = xAccessor(candle);
        endX = Math.ceil(
          startIndex + (endTime - startTime) / this.intervalMiliseconds
        );
      }

      return xScale(endX);
    },

    // Color it base on the WIN/LOST result status
    stroke: (candle) => {
      const { botSignals } = this.props;
      const signalsMap = botSignals?.signalsMap ?? {};

      const signal = signalsMap[candle.opentime];
      if (!signal?.orderResult?.status) return null;

      return signal.orderResult.status === 'WIN' ? '#00FF00' : '#FF0000';
    },
    strokeDasharray: 'ShortDash',
  };
}
