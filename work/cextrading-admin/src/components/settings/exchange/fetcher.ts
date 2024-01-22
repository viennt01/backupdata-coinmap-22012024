import { deleteGW, get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';

import { Exchange } from './interface';

export interface RawExchange {
  exchange_name: string;
  exchange_desc: string;
  created_at: string;
}

export interface RawExchangeCreate {
  exchange_name: RawExchange['exchange_name'];
  exchange_desc: RawExchange['exchange_desc'];
}

export const normalizeExchange = (resolutions: RawExchange[]): Exchange[] => {
  return resolutions.map((r) => ({
    exchangeName: r.exchange_name,
    exchangeDesc: r.exchange_desc,
    createdAt: format(Number(r.created_at), 'dd/MM/yyyy'),
  }));
};

export const getExchanges = () => {
  return get<Response<RawExchange[]>>({})(API_ADMIN.EXCHANGE_LIST);
};

export const createExchange = (data: RawExchangeCreate[]) => {
  return post<
    {
      exchanges: RawExchangeCreate[];
    },
    Response<RawExchange[]>
  >({
    data: {
      exchanges: data,
    },
  })(API_ADMIN.EXCHANGE_CREATE);
};

export const deleteExchange = (exchangeName: RawExchange['exchange_name']) => {
  return deleteGW<null, ResponseWithoutPayload>({})(
    `${API_ADMIN.EXCHANGE_DELETE}/${exchangeName}`,
  );
};

export const getExchange = (exchangeName: RawExchange['exchange_name']) => {
  return get<Response<RawExchange>>({})(
    `${API_ADMIN.EXCHANGE_DETAIL}/${exchangeName}`,
  );
};

export const editExchange = (data: RawExchangeCreate) => {
  return put<RawExchangeCreate, Response<RawExchange[]>>({ data })(
    API_ADMIN.EXCHANGE_EDIT,
  );
};
