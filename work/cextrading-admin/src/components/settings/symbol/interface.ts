export enum SYMBOL_STATUS {
  ON = 'ON',
  OFF = 'OFF',
}
export interface Tick {
  tickvalue: number;
  tickvalueHeatmap: number;
}

export interface ISymbol {
  symbol: string;
  types: string;
  exchangeName: string;
  baseSymbol: string;
  quoteSymbol: string;
  description: string;
  ticks: Tick;
  status: SYMBOL_STATUS;
  timezone?: string;
  minmov?: number;
  minmov2?: number;
  pointvalue?: number;
  session?: string;
  hasIntraday?: boolean;
  hasNoVolume?: boolean;
  pricescale?: number;
  createdAt: string;
}

export interface CreateSymbol {
  symbol: string;
  types: string;
  exchangeName: string;
  baseSymbol: string;
  quoteSymbol: string;
  description: string;
  ticks: Tick;
  ['ticks.tickvalue']: number;
  ['ticks.tickvalueHeatmap']: number;
  status: SYMBOL_STATUS;
  timezone?: string;
  minmov?: number;
  minmov2?: number;
  pointvalue?: number;
  session?: string;
  hasIntraday?: boolean;
  hasNoVolume?: boolean;
  pricescale?: number;
}
export interface UpdateSymbolStatus {
  symbol: string;
  status: SYMBOL_STATUS;
}
