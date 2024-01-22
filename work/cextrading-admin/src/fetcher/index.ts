import router from 'next/router';
import { myLocalStorage } from 'utils';
import { headers as configHeaders } from './utils';

interface Headers {
  locale?: string;
  Authorization?: string;
}

export enum VERSION_BASE_URL {
  V1 = 'v1',
  V2 = 'v2',
}

const MS_TIMEOUT = 10000;
const BASE_URL = process.env.BASE_URL;

function handleTokenExpiredTime() {
  myLocalStorage.delete('token');
  configHeaders.removeToken();
  router.push('/sign-in');
}

function getBaseUrlVersion(version = VERSION_BASE_URL.V1) {
  return version;
}

function requestWithTimeout(
  promise: Promise<Response>,
  ms = MS_TIMEOUT,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(JSON.stringify({ message: 'Request timeout' })));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
}

export const get =
  <T>({
    options,
    headers,
    version,
  }: {
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    headers?: Headers & { 'x-pomerium-authenticated-user-email'?: string };
  }) =>
  (url: string): Promise<T> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      }),
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();

        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed');
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const post =
  <T, R>({
    data,
    options,
    headers,
    timeout,
    version,
  }: {
    // eslint-disable-next-line
    data: T;
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    headers?: Headers;
    timeout?: number;
  }) =>
  (url: string): Promise<R> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
      timeout ?? MS_TIMEOUT,
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const put =
  <T, R>({
    data,
    options,
    headers,
    version,
  }: {
    // eslint-disable-next-line
    data: T;
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    headers?: Headers;
  }) =>
  (url: string): Promise<R> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const download =
  ({
    options,
    timeout,
    headers,
    version,
  }: {
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    timeout?: number;
    headers?: Headers;
  }) =>
  (url: string): Promise<any> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      }),
      timeout ?? MS_TIMEOUT,
    )
      .then(async (res) => {
        if (res.ok) {
          return res;
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const patch =
  <R>({
    data,
    options,
    headers,
    version,
  }: {
    // eslint-disable-next-line
    data: any;
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    headers?: Headers;
  }) =>
  (url: string): Promise<R> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const deleteGW =
  <T, R>({
    options,
    headers,
    version,
  }: {
    data?: T;
    version?: VERSION_BASE_URL;
    options?: RequestInit;
    headers?: Headers;
  }) =>
  (url: string): Promise<R> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'DELETE',
      }),
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };

export const uploadFile =
  <R>({
    data,
    headers,
    timeout,
    version,
  }: {
    // eslint-disable-next-line
    data: FormData;
    version?: VERSION_BASE_URL;
    headers?: Headers;
    timeout?: number;
  }) =>
  (url: string): Promise<R> => {
    return requestWithTimeout(
      fetch(`${BASE_URL}/${getBaseUrlVersion(version)}${url}`, {
        headers: {
          Authorization: configHeaders.headers.Authorization,
          ...headers,
        },
        method: 'POST',
        body: data,
      }),
      timeout,
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        if (res.status === 401) {
          handleTokenExpiredTime();
        }
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  };
