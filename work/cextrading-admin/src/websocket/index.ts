import { headers } from 'fetcher/utils';
import router from 'next/router';
import { myLocalStorage } from 'utils';
export enum WS_MESSAGE {
  connect = 'connect',
  disconnect = 'disconnect',
  logout = 'logout',
  session_invalid = 'session_invalid',
  verify = 'verify',
}

let connected = false;
let ws: WebSocket;
function handleTokenInvalid() {
  myLocalStorage.delete('token');
  headers.removeToken();
  router.push('/sign-in');
}

export function connect() {
  return; // disable ws
  const token = myLocalStorage.get('token');
  const url = process.env.WS_URL;
  if (!connected && token && url) {
    connected = true;
    try {
      ws = new WebSocket(url);
      ws.onopen = function () {
        ws.send(
          JSON.stringify({
            event: WS_MESSAGE.verify,
            data: token,
          }),
        );
        console.log('WS_MESSAGE connect');
      };

      ws.onmessage = function (e) {
        console.log('Message:', e.data);
        try {
          const message = JSON.parse(e.data);
          if (
            message.event === WS_MESSAGE.logout ||
            message.event === WS_MESSAGE.session_invalid
          ) {
            connected = false;
            ws.close();
            handleTokenInvalid();
          }
        } catch (error) {}
      };

      ws.onclose = function (e) {
        console.log('WS_MESSAGE disconnect', e);
        connected = false;
        setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = function () {
        connected = false;
        setTimeout(() => {
          connect();
        }, 3000);
      };
    } catch (error) {
      console.log('error', error);
      connected = false;
      setTimeout(() => {
        connect();
      }, 3000);
    }
  } else if (token && ws && ws.readyState === 1) {
    ws.send(
      JSON.stringify({
        event: WS_MESSAGE.verify,
        data: token,
      }),
    );
  }
}
