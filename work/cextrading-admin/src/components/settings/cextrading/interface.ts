export interface AppSeting {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  ownerCreated: string;
  updatedAt: string;
  value: string;
}

export enum ON_OFF {
  ON = 'ON',
  OFF = 'OFF',
}

export enum SETTING_NAME {
  ON_OFF_REGISTER = 'ON_OFF_REGISTER',
  ON_OFF_LOCALSTORAGE = 'ON_OFF_LOCALSTORAGE',
  BROKER_SERVER = 'BROKER_SERVER',
  CURRENCY_PKG = 'CURRENCY_PKG',
  CURRENCY_SBOT = 'CURRENCY_SBOT',
  CURRENCY_TBOT = 'CURRENCY_TBOT',
}

export interface BrokerServer {
  [key: string]: string[];
}
