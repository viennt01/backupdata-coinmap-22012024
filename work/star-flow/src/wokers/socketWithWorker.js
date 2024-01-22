/**
 * Close socket and terminate worker
 * @param {Worker} worker
 * @param {number | string} code
 */
export const handleClose = (worker, code) => {
  worker.postMessage({ task: 'close', code });
  setTimeout(() => {
    worker.terminate();
  }, 1000);
};

/**
 * Send data to socket
 * @param {Worker} worker
 * @param {number | string} code
 */
export const handleSend = (worker, code) => {
  worker.postMessage({ task: 'send', code });
};

/**
 * Connect socket via worker
 * @param {{ url: String, onMessage: Function }} options
 * @returns woker and close socket method
 */
export const initSocketWorker = ({
  url,
  onMessage,
  onOpen,
  onClose,
  limitReconnect = Infinity,
}) => {
  // create new worker
  const worker = new Worker(new URL('./socket.worker.js', import.meta.url));

  // classify message received from worker
  const handlers = {
    onmessage: onMessage,
    onopen: onOpen,
    onclose: onClose,
  };
  worker.onmessage = (event) => {
    const handlerFunc = handlers[event?.data?.type];
    if (!handlerFunc) return;
    handlerFunc({ ...event, data: event.data.data });
  };

  // send message to worker to create socket
  worker.postMessage({ task: 'connect', url, limitReconnect });

  const close = (code) => handleClose(worker, code);

  const send = (code) => handleSend(worker, code);

  return {
    worker,
    ws: {
      close,
      send,
    },
  };
};
