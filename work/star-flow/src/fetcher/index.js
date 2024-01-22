import { headers as configHeaders, headersUploadFromData } from './utils';

const MS_TIMEOUT = 10000;
export const API_DEFAULT_GW = process.env.API_DEFAULT_GW;
export const API_USER_ROLES_GW = process.env.API_USER_ROLES_GW;
export const API_USER_ROLES_GW_V2 = process.env.API_USER_ROLES_GW_V2;
const API_MAIN_GW = process.env.API_MAIN_GW;
const BOT_COINMAP_GW = process.env.BOT_COINMAP_GW;
const API_HEATMAP_GW = process.env.API_HEATMAP_GW;

export const GATEWAY = {
  API_DEFAULT_GW: 'API_DEFAULT_GW',
  API_USER_ROLES_GW: 'API_USER_ROLES_GW',
  API_USER_ROLES_GW_V2: 'API_USER_ROLES_GW_V2',
  API_MAIN_GW: 'API_MAIN_GW',
  BOT_COINMAP_GW: 'BOT_COINMAP_GW',
  API_HEATMAP_GW: 'API_HEATMAP_GW',
};

export const ABORT_MESSAGE = 'canceled';

const getGateway = (gw) => {
  switch (gw) {
    case GATEWAY.API_DEFAULT_GW: {
      return API_DEFAULT_GW;
    }
    case GATEWAY.API_USER_ROLES_GW: {
      return API_USER_ROLES_GW;
    }
    case GATEWAY.API_USER_ROLES_GW_V2: {
      return API_USER_ROLES_GW_V2;
    }
    case GATEWAY.API_MAIN_GW: {
      return API_MAIN_GW;
    }
    case GATEWAY.BOT_COINMAP_GW: {
      return BOT_COINMAP_GW;
    }
    case GATEWAY.API_HEATMAP_GW: {
      return API_HEATMAP_GW;
    }
    default: {
      return API_MAIN_GW;
    }
  }
};

function requestWithTimeout(promise, ms = MS_TIMEOUT) {
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
}

export const get =
  ({ options, headers, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      })
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed');
      })
      .catch((err) => {
        // throw new Error(err?.message)
        if (err?.name === 'AbortError') {
          return { message: ABORT_MESSAGE };
        }
        return { error: JSON.parse(err.message) };
      });
  };

export const post =
  ({ data, options, headers, timeout, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      }),
      timeout ?? MS_TIMEOUT
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

export const put =
  ({ data, options, headers, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      })
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

export const download =
  ({ options, timeout, headers, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
      }),
      timeout ?? MS_TIMEOUT
    )
      .then(async (res) => {
        if (res.ok) {
          return res;
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

export const patch =
  ({ data, options, headers, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

export const deleteGW =
  ({ data, options, headers, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: { ...configHeaders.headers, ...headers },
        ...options,
        method: 'DELETE',
        body: JSON.stringify(data),
      })
    )
      .then(async (res) => {
        // 200
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };

export const uploadFile =
  ({ data, headers, timeout, gw }) =>
  (url) => {
    return requestWithTimeout(
      fetch(`${getGateway(gw)}${url}`, {
        headers: {
          ...headersUploadFromData.headers,
          ...headers,
        },
        method: 'POST',
        body: data,
      }),
      timeout
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const error = await res.json();
        throw new Error(JSON.stringify(error) || 'Request failed'); // throw error to catch, need to parse before use
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  };
