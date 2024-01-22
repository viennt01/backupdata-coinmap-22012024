import { setUserProfile } from '@/redux/actions/userProfile';
import { initialState } from '@/redux/reducers/userProfile';
import { setDeactivate } from '@/redux/actions/common';
import { LOCAL_CACHE_KEYS } from '@/config';
import { localStore } from '@/utils/localStorage';
import { initSocketWorker } from '@/wokers/socketWithWorker';
import { headers, headersUploadFromData } from '@/fetcher/utils';
import { URLS } from '@/config';
import { API_MESSSAGE } from '@/constant/messsage';
import { generateUUID } from './generator';
import { TRANSACTION_STATUS } from '@/constant/codeConstants';
import { openNotification, NOTIFICATION_TYPE } from '@/hook/notification';

export const SOCKET_EVENTS = {
  VERIFY: 'verify',
  LOGOUT: 'logout',
  SESSION_INVALID: 'session_invalid',
  DEACTIVATE: 'deactivate',
  CHECK_DEVICE: 'check_device',
  TRANSACTION_UPDATE: 'transaction_update',
  TBOT_INIT: 'tbot_init',
  TBOT_CLOSE: 'tbot_close',
  TBOT_TRADE_UPDATE: 'tbot_trade_update',
  TBOT_CHART_PNL_UPDATE: 'tbot_chart_pnl_update',
};

class LimitDevice {
  _socket;
  _router;
  _dispatch;

  // common functions
  // clear token and user profile in redux
  clearLoginData() {
    localStore.remove(LOCAL_CACHE_KEYS.CM_TOKEN);
    headersUploadFromData.setToken('');
    headers.setToken('');
    this._dispatch(setUserProfile(initialState.user));
  }

  // send verify event to check device limitation
  sendVerifyEvent() {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (!token) return this.clearLoginData();
    if (!this._socket) return this.initialSocket({});

    const message = JSON.stringify({
      event: SOCKET_EVENTS.VERIFY,
      data: token,
    });
    this._socket.ws.send(message);
  }

  // close and remove socket
  closeSocket() {
    this._socket?.ws?.close();
    this._socket = undefined;
  }

  // set value for login id to deactivate other tabs
  deactivateOtherTabs() {
    localStore.set(LOCAL_CACHE_KEYS.LOGIN_ID, generateUUID());
  }

  // remove value of login id to force logout other tabs
  logoutOtherTabs() {
    localStore.remove(LOCAL_CACHE_KEYS.LOGIN_ID);
  }

  // deactivate or logout other tabs when login id changed
  handleLoginIdChange(e) {
    if (e.storageArea != localStorage || e.key !== LOCAL_CACHE_KEYS.LOGIN_ID)
      return;

    if (!e.newValue) return this.forceLogout();
    if (window.location.pathname === '/login') {
      this._router.push('/profile', undefined, { shallow: true });
    }
    this._dispatch(setDeactivate(true));
  }

  addEventListener(eventId, eventHandler) {
    this._eventHandler[eventId] = eventHandler;
  }

  removeEventListener(eventId) {
    delete this._eventHandler[eventId];
  }

  sendMessage(event, data) {
    if (!this._socket) return console.log('Socket not found');
    const message = { event };
    if (data) message.data = data;
    this._socket.ws.send(JSON.stringify(message));
  }

  // force logout and show message
  forceLogout(message) {
    this.clearLoginData();
    this.closeSocket();
    this.logoutOtherTabs();
    this._dispatch(setDeactivate(false));
    if (message)
      openNotification({
        type: NOTIFICATION_TYPE.ERROR,
        message: '',
        description: message,
      });
    this._router.push('/login');
  }

  // functions using in onmessage
  // logout and show error message
  _handleSessionInvalid() {
    if (!this._socket) return;
    this.forceLogout(API_MESSSAGE.LOGIN.SESSION_INVALID);
  }

  // logout and show error message
  _handleLogout() {
    if (!this._socket) return;
    this.forceLogout(API_MESSSAGE.LOGIN.MULTIPLE_DEVICE);
  }

  // show deactivate page
  _handleDeactivate() {
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);
    this._dispatch(setDeactivate(true));
  }

  // store verify id in local storage
  _handleVerify(data) {
    localStore.set(LOCAL_CACHE_KEYS.VERIFY_ID, data);
    const sendData = {
      event: SOCKET_EVENTS.CHECK_DEVICE,
    };
    this._socket.ws.send(JSON.stringify(sendData));
  }

  // check verify id in local storage with data received from socket
  _handleCheckDevice(data) {
    const verifyId = localStore.get(LOCAL_CACHE_KEYS.VERIFY_ID);
    if (data === verifyId) return;
    this.forceLogout(API_MESSSAGE.LOGIN.MULTIPLE_DEVICE);
  }

  // check transaction status
  _handleCheckTransactionStatus(data) {
    const { transaction_id, status } = data;

    // only handle in checkout page
    const checkoutPath = `/payment/checkout?transaction_id=${transaction_id}`;
    if (!this._router.asPath.includes(checkoutPath)) return;

    if (status === TRANSACTION_STATUS.COMPLETE) {
      this._router.push('/profile?tab=2');
      openNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        message: '',
        description: 'Payment successful',
      });
    }
    if (status === TRANSACTION_STATUS.FAILED) {
      const pathname = this._router.pathname;
      pathname.replace('checkout', 'timeout');
      this._router.push({
        pathname,
        query: { transaction_id },
      });
    }
  }

  _eventHandler = {
    [SOCKET_EVENTS.LOGOUT]: this._handleLogout.bind(this),
    [SOCKET_EVENTS.SESSION_INVALID]: this._handleSessionInvalid.bind(this),
    [SOCKET_EVENTS.DEACTIVATE]: this._handleDeactivate.bind(this),
    [SOCKET_EVENTS.VERIFY]: this._handleVerify.bind(this),
    [SOCKET_EVENTS.CHECK_DEVICE]: this._handleCheckDevice.bind(this),
    [SOCKET_EVENTS.TRANSACTION_UPDATE]:
      this._handleCheckTransactionStatus.bind(this),
  };

  _onOpen() {
    this.sendVerifyEvent();
  }

  _onMessage(e) {
    const { event, data } = JSON.parse(e.data);
    const eventHandler = this._eventHandler[event];
    if (!eventHandler) return console.log('Not found event handler of ', event);
    eventHandler(data);
  }

  _onClose() {
    this.forceLogout();
  }

  initialSocket({ router, dispatch }) {
    this._router ??= router;
    this._dispatch ??= dispatch;
    this._socket = initSocketWorker({
      url: URLS.WS_LIMIT_DEVICE,
      onOpen: this._onOpen.bind(this),
      onMessage: this._onMessage.bind(this),
      onClose: this._onClose.bind(this),
      limitReconnect: 5,
    });
  }
}

export const limitDevice = new LimitDevice();
