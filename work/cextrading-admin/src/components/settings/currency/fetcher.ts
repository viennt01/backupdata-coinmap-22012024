import { deleteGW, get, post, put, uploadFile } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';

import { Currency } from './interface';

export interface RawUpload {
  file_url: string;
}
export interface RawCurrency {
  id: string;
  name: string;
  description: string;
  currency: string;
  image_url: string;
  owner_created: string;
  status: boolean;
  order: number;
  created_at: number;
  updated_at: number;
}
export interface RawCurrencyCreate {
  name: RawCurrency['name'];
  description: RawCurrency['description'];
  currency: RawCurrency['currency'];
  image_url: RawCurrency['image_url'];
}
export interface RawCurrencyUpdate {
  name?: RawCurrency['name'];
  description?: RawCurrency['description'];
  currency?: RawCurrency['currency'];
  image_url?: RawCurrency['image_url'];
  status?: RawCurrency['status'];
}

export const normalizeCurrency = (bots: RawCurrency[]): Currency[] => {
  return bots.map((b, index) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    currency: b.currency,
    status: b.status,
    imageUrl: b.image_url,
    ownerCreated: b.owner_created,
    order: index + 1,
    createdAt: format(Number(b.created_at), 'dd/MM/yyyy'),
    updatedAt: format(Number(b.updated_at), 'dd/MM/yyyy'),
  }));
};

export const listCurrency = () => {
  return get<Response<RawCurrency[]>>({})(API_ADMIN.CURRENCY_LIST);
};

export const createCurrency = (data: RawCurrencyCreate) => {
  return post<RawCurrencyCreate, Response<RawCurrency>>({ data })(
    API_ADMIN.CURRENCY_CREATE,
  );
};

export const deleteCurrency = (id: RawCurrency['id']) => {
  return deleteGW<null, ResponseWithoutPayload>({})(
    `${API_ADMIN.CURRENCY_DELETE}/${id}`,
  );
};

export const getCurrency = (id: RawCurrency['id']) => {
  return get<Response<RawCurrency>>({})(`${API_ADMIN.CURRENCY_DETAIL}/${id}`);
};

export const editCurrency = (
  id: RawCurrency['id'],
  data: RawCurrencyUpdate,
) => {
  return put<RawCurrencyUpdate, Response<RawCurrency>>({ data })(
    `${API_ADMIN.CURRENCY_EDIT}/${id}`,
  );
};

export const uploadImage = (data: any) => {
  return uploadFile<Response<RawUpload>>({ data })(`${API_ADMIN.UPLOAD_FILE}`);
};

export interface RawCurrencyOrderUpdate {
  currencies: { id: string; order: number }[];
}

export const updateOrderCurrency = (data: RawCurrencyOrderUpdate) => {
  return put<RawCurrencyOrderUpdate, Response<RawCurrency[]>>({ data: data })(
    `${API_ADMIN.CURRENCY_EDIT}/order`,
  );
};
