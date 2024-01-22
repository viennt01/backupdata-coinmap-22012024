import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { appLocalStorage } from '@/utils/localstorage';
import { headers } from './utils';

export enum WSS_EVENTS {
  VERIFY = 'verify',
  INIT_BOT = 'tbot_init',
  UPDATE_BOT = 'tbot_update',
  LOGOUT = 'logout',
  TRADE_UPDATE = 'tbot_trade_update', // update trade history
  PNL_UPDATE = 'tbot_chart_pnl_update', //  update chart pnl in bot detail
  STRATEGY_INIT_BOT = 'tbot_strategy_init',
  STRATEGY_CLOSE_BOT = 'tbot_strategy_close',
  STRATEGY_TRADE_UPDATE = 'tbot_strategy_trade_update', // update trade history
  STRATEGY_PNL_UPDATE = 'tbot_strategy_chart_pnl_update', //  update chart pnl in bot detail
}

class AppWebsocket {
  _socket: WebSocket;
  _eventHandler: Record<WSS_EVENTS | any, (data: unknown) => void> = {};
  constructor(url: string) {
    const socket = new WebSocket(url);
    this._socket = socket;
    this.onmMessage();
  }
  addEventListener(event: WSS_EVENTS, listener: (data: unknown) => void) {
    this._eventHandler[event] = listener;
  }
  removeEventListener(event: WSS_EVENTS) {
    delete this._eventHandler[event];
  }
  onmMessage() {
    this._socket.onmessage = (response) => {
      const { event, data }: { event: WSS_EVENTS; data: unknown } = JSON.parse(
        response.data
      );
      if (this._eventHandler[event]) {
        this._eventHandler[event](data);
      }
    };
  }
  onopen(listener: (ev: unknown) => void) {
    this._socket.onopen = listener;
  }
  onError(listener: (ev: unknown) => void) {
    this._socket.onerror = listener;
  }

  sendMesssage(event: string, data?: string) {
    const sendData: { [key: string]: string } = { event };
    if (data) sendData.data = data;
    this._socket.send(JSON.stringify(sendData));
  }

  close() {
    this._socket.close();
  }

  logout(callback: () => void) {
    appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
    headers.setToken(null);
    if (callback) {
      callback();
    }
  }
}

export default AppWebsocket;
