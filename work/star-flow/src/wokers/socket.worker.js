import { wsConnector } from '@/utils/apiCaller';

const state = {};

const onmessage = (event) => {
  self.postMessage({ type: 'onmessage', data: event.data });
};

const onopen = (event) => {
  self.postMessage({ type: 'onopen', data: event.data });
};

const onclose = (event) => {
  self.postMessage({ type: 'onclose', data: event.data });
};

const handleConnect = (event) => {
  const eventData = event.data;

  state.ws = wsConnector(eventData.url, {
    onmessage,
    onopen,
    onclose,
    limitReconnect: eventData.limitReconnect,
  });
};

const handleClose = (event) => {
  if (state?.ws?.close) {
    state.ws.close(event?.data?.code || 1000);
  }
};

const handleSend = (event) => {
  state.ws?.ws?.send(event?.data?.code || '');
};

const handlers = {
  connect: handleConnect,
  close: handleClose,
  send: handleSend,
};

const eventDispatcher = (event) => {
  const task = event?.data?.task;
  const handlerFunc = handlers[task];
  if (!handlerFunc) {
    console.log('WORKER - invalid task for event', event);
    return;
  }

  handlerFunc(event);
};

self.addEventListener('message', eventDispatcher);
