import { ERROR_CODE } from '@/constants/error-code';
import { notification } from 'antd';
import { headers as configHeaders } from './utils';
import Router from 'next/router';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { ERROR_MESSAGE } from '@/constants/message';
import style from './notification.module.scss';
import ROUTERS from '@/constants/router';
export interface ResponseWithPayload<R> {
  error_code: ERROR_CODE;
  message?: string;
  payload: R;
}

interface CRUDProps<T> {
  data?: T;
  options?: RequestInit;
  headers?: HeadersInit;
  gw?: string;
  timeout?: number;
}

const MS_TIMEOUT = 10000;
const API_MAIN_GW = process.env.API_MAIN_GW;
const API_USER_GW = process.env.API_USER_GW;

export const GATEWAY = {
  API_MAIN_GW: 'API_MAIN_GW',
  API_USER_GW: 'API_USER_GW',
};

const getGateway = (gw?: string) => {
  switch (gw) {
    case GATEWAY.API_MAIN_GW: {
      return API_MAIN_GW;
    }
    case GATEWAY.API_USER_GW: {
      return API_USER_GW;
    }
    default: {
      return API_MAIN_GW;
    }
  }
};

const requestWithTimeout = (
  promise: Promise<Response>,
  ms = MS_TIMEOUT
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

const fetchResolver = (promise: Promise<Response>) => {
  return promise
    .then(async (res) => {
      if (res.ok) return res.json();
      const error = await res.json();
      throw new Error(JSON.stringify(error) || 'Request failed');
    })
    .catch((err) => {
      const errorCode = JSON.parse(err.message).error_code;
      if (
        [ERROR_CODE.TOKEN_EXPIRED, ERROR_CODE.TOKEN_INVALID].includes(errorCode)
      ) {
        notification.error({
          key: ERROR_CODE.TOKEN_EXPIRED,
          message: ERROR_MESSAGE.TOKEN_EXPIRED,
          className: style.notificationCustom,
        });
        appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
        configHeaders.setToken(null);
        Router.replace(ROUTERS.LOGIN);
        return;
      }
      throw new Error(err.message);
    });
};

export const get =
  <T, R>({ options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string): Promise<R> => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const post =
  <T, R>({ data, options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string): Promise<R> => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const put =
  <T, R>({ data, options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string): Promise<R> => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const download =
  <T>({ options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string) => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const patch =
  <T>({ data, options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string) => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const deleteGW =
  <T>({ data, options, headers, gw, timeout }: CRUDProps<T>) =>
  (url: string) => {
    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'DELETE',
        body: JSON.stringify(data),
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };

export const uploadFile =
  <R>({ data, headers, gw, timeout }: CRUDProps<FormData>) =>
  (url: string): Promise<R> => {
    const headersInit: HeadersInit = { ...configHeaders.headers };
    delete headersInit['content-type'];

    const fetchPromise = requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: {
          ...headersInit,
          ...headers,
        },
        method: 'POST',
        body: data,
      }),
      timeout
    );
    return fetchResolver(fetchPromise);
  };
