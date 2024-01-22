import { BOT_STATUS } from './interface';

export const TABS_DATA: {
  title: string;
  key:
    | BOT_STATUS.ALL
    | BOT_STATUS.ACTIVE
    | BOT_STATUS.DISCONNECTED
    | BOT_STATUS.NOT_CONNECT
    | BOT_STATUS.INACTIVE;
}[] = [
  {
    title: 'All (#)',
    key: BOT_STATUS.ALL,
  },
  {
    title: 'Activated',
    key: BOT_STATUS.ACTIVE,
  },
  {
    title: 'Not connected',
    key: BOT_STATUS.NOT_CONNECT,
  },
  {
    title: 'Suspended',
    key: BOT_STATUS.DISCONNECTED,
  },
  {
    title: 'Deactivated',
    key: BOT_STATUS.INACTIVE,
  },
];

export const FILTER_STATUS_DATA: {
  [BOT_STATUS.ALL]: string;
  [BOT_STATUS.ACTIVE]: string;
  [BOT_STATUS.DISCONNECTED]: string;
  [BOT_STATUS.NOT_CONNECT]: string;
  [BOT_STATUS.INACTIVE]: string;
} = {
  [BOT_STATUS.ALL]: BOT_STATUS.ALL,
  [BOT_STATUS.ACTIVE]: BOT_STATUS.ACTIVE,
  [BOT_STATUS.DISCONNECTED]: `${BOT_STATUS.NOT_ENOUGH_BALANCE},${BOT_STATUS.DISCONNECTED},${BOT_STATUS.EXPIRED},${BOT_STATUS.INACTIVE_BY_SYSTEM}`,
  [BOT_STATUS.NOT_CONNECT]: `${BOT_STATUS.NOT_CONNECT},${BOT_STATUS.CONNECTING}`,
  [BOT_STATUS.INACTIVE]: BOT_STATUS.INACTIVE,
};
