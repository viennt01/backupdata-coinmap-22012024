import { deleteGW, get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';

import { ISymbol, SYMBOL_STATUS } from './interface';

export interface RawTick {
  tickvalue: number;
  tickvalueHeatmap: number;
}

export interface RawSymbol {
  symbol: string;
  types: string;
  exchange_name: string;
  base_symbol: string;
  quote_symbol: string;
  description: string;
  ticks: RawTick;
  status: SYMBOL_STATUS;
  timezone?: string;
  minmov?: number;
  minmov2?: number;
  pointvalue?: number;
  session?: string;
  has_intraday?: boolean;
  has_no_volume?: boolean;
  pricescale?: number;
  created_at: string;
}

export interface RawSymbolCreate {
  symbol: string;
  types: string;
  exchange_name: string;
  base_symbol: string;
  quote_symbol: string;
  description: string;
  ticks: RawTick;
  status: SYMBOL_STATUS;
  timezone?: string;
  minmov?: number;
  minmov2?: number;
  pointvalue?: number;
  session?: string;
  has_intraday?: boolean;
  has_no_volume?: boolean;
  pricescale?: number;
}

export interface RawSymbolUpdate {
  symbol?: string;
  types?: string;
  exchange_name?: string;
  base_symbol?: string;
  quote_symbol?: string;
  description?: string;
  ticks?: RawTick;
  status?: SYMBOL_STATUS;
  timezone?: string;
  minmov?: number;
  minmov2?: number;
  pointvalue?: number;
  session?: string;
  has_intraday?: boolean;
  has_no_volume?: boolean;
  pricescale?: number;
}

export const normalizeSymbol = (symbols: RawSymbol[]): ISymbol[] => {
  return symbols.map((s) => ({
    symbol: s.symbol,
    types: s.types,
    exchangeName: s.exchange_name,
    baseSymbol: s.base_symbol,
    quoteSymbol: s.quote_symbol,
    description: s.description,
    ticks: {
      tickvalue: s.ticks.tickvalue,
      tickvalueHeatmap: s.ticks.tickvalueHeatmap,
    },
    createdAt: format(Number(s.created_at), 'dd/MM/yyyy'),
    status: s.status,
    timezone: s.timezone,
    minmov: s.minmov,
    minmov2: s.minmov2,
    pointvalue: s.pointvalue,
    session: s.session,
    hasIntraday: s.has_intraday,
    hasNoVolume: s.has_no_volume,
    pricescale: s.pricescale,
  }));
};

export const getSymbols = () => {
  return get<Response<RawSymbol[]>>({})(API_ADMIN.SYMBOL_LIST);
};

export const getSymbol = (symbolName: RawSymbol['symbol']) => {
  return get<Response<RawSymbol>>({})(
    `${API_ADMIN.SYMBOL_DETAIL}/${symbolName}`,
  );
};

export const createSymbol = (data: RawSymbolCreate[]) => {
  return post<
    {
      symbols: RawSymbolCreate[];
    },
    Response<RawSymbol>
  >({
    data: {
      symbols: data,
    },
  })(API_ADMIN.SYMBOL_CREATE);
};

export const deleteSymbol = (SymbolName: RawSymbol['symbol']) => {
  return deleteGW<null, ResponseWithoutPayload>({})(
    `${API_ADMIN.SYMBOL_DELETE}/${SymbolName}`,
  );
};

export const editSymbol = (
  data: Omit<RawSymbolUpdate, 'symbol'>,
  symbolName: RawSymbolUpdate['symbol'],
) => {
  return put<Omit<RawSymbolUpdate, 'symbol'>, Response<RawSymbol[]>>({ data })(
    `${API_ADMIN.SYMBOL_DELETE}/${symbolName}`,
  );
};
