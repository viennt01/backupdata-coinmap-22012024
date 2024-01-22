export const SYMBOL = {
  DESCRIPTION: 'DESCRIPTION',
  TICKER: 'TICKER',
  TICKER_AND_DESCRIPTION: 'TICKER_AND_DESCRIPTION',
};

const STATUS_LINE_SETTINGS = {
  symbol: SYMBOL.DESCRIPTION,
  openMarketStatus: true,
  OHCLValues: true,
  barChangeValues: true,
  volume: true,
  indicatorTitles: true,
  indicatorValue: true,
};

export default STATUS_LINE_SETTINGS;
