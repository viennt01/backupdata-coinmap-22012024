import axios from 'axios';
import { LOCAL_CACHE_KEYS, URLS } from '@/config';
import { ADD_ERROR } from '@/redux/const/ActionTypes';
import { w3cwebsocket } from 'websocket';
import { localStore } from './localStorage';

export const ABORT_MESSAGE = 'canceled';

export default function callApi(
  endpoint,
  method = 'GET',
  body = undefined,
  { dispatch, withToken = true } = {},
  signal = undefined
) {
  const url =
    endpoint.indexOf('http') === 0
      ? endpoint
      : `${URLS.API_MAIN_GW}${endpoint}`;

  const headers = {};
  if (withToken) {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    headers.Authorization = `Bearer ${token}`;
  }

  return axios({
    method: method,
    url,
    data: body,
    headers,
    signal,
  }).catch((err) => {
    console.log('Error when request API:', { err }, Object.keys(err));
    if (dispatch) {
      dispatch({
        type: ADD_ERROR,
        error: err.message || 'Lỗi không xác định',
      });
    }
    if (err.message === ABORT_MESSAGE) {
      return { data: undefined, message: ABORT_MESSAGE };
    }
  });
}

export const SOCKET_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};
const DEFAULT_WS_CLOSE = 1000;
const reconnectTimeoutStep = 2000;
const noop = () => {};
export const wsConnector = (
  url,
  options = { onopen: noop, onmessage: noop, onclose: noop, onerror: noop }
) => {
  const {
    onclose,
    onopen,
    autoReconnect = true,
    onReconnect,
    limitReconnect = Infinity,
    ...listeners
  } = options;

  const instance = {
    ws: null,
    connect: noop,
    handleClose: noop,
    onOpen: noop,
    close: noop,
    reconnectTimeout: 0,
    reconnectCount: 0,
  };

  const handleSoftClose = (socket, closeCode = DEFAULT_WS_CLOSE) => {
    if (!socket) return;
    if (socket.readyState === SOCKET_STATE.OPEN) {
      socket.close(closeCode);
    }
    if (socket.readyState === SOCKET_STATE.CONNECTING) {
      socket.onopen = () => socket.close(closeCode);
    }
  };

  instance.onOpen = () => {
    if (instance.connectInterval) {
      clearInterval(instance.connectInterval);
      delete instance.connectInterval;
    }
    instance.reconnectTimeout = 0;
    instance.reconnectCount = 0;
    if (onopen) {
      onopen(instance.ws);
    }
  };

  instance.handleClose = (e) => {
    if (!e.code || [1000, 1001].includes(e.code)) {
      return;
    }

    if (instance.connectInterval) {
      return;
    }

    if (onReconnect) {
      onReconnect();
    }

    // step up delay each reconnect
    instance.reconnectTimeout += reconnectTimeoutStep;
    instance.connectInterval = setInterval(() => {
      instance.connect();
    }, instance.reconnectTimeout);
  };

  instance.connect = () => {
    // Socket is connecting or open
    if ([0, 1].includes(instance.ws?.readyState)) {
      return instance.ws;
    }

    const ws = new w3cwebsocket(url);
    Object.keys(listeners).map((key) => {
      const listener = listeners[key];
      ws[key] = listener;
    });

    if (!autoReconnect) {
      ws.onclose = onclose;
    } else if (instance.reconnectCount < limitReconnect) {
      ws.onclose = instance.handleClose;
    } else {
      ws.onclose = onclose;
      clearInterval(instance.connectInterval);
      delete instance.connectInterval;
    }

    ws.onerror = (err) => {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      );
      ws.close();
    };

    ws.onopen = instance.onOpen;

    instance.ws = ws;

    instance.reconnectCount += 1;

    return ws;
  };

  instance.close = (closeCode) => {
    if (instance.ws && instance.ws.close) {
      handleSoftClose(instance.ws, closeCode);
      instance.ws = null;
    }
  };

  instance.connect();

  return instance;
};
