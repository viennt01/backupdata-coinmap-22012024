export interface Bot {
  id: string;
  name: string;
  cloneName?: string;
  type: string;
  code: string;
  description: string;
  workBasedOn: string[];
  status: string;
  price: string;
  displayPrice: number | null;
  currency: string;
  imageUrl: string;
  order: number;
  bought: number;
  pnl: string;
  max_drawdown: string;
  tokenFirst: string;
  tokenSecond: string;
  balance: string;
  backTest: string;
  maxDrawdownChangePercent: number;
  translation: {
    [index: string]: {
      description: Bot['description'];
      workBasedOn: Bot['workBasedOn'];
    };
  };

  ownerCreated: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBot {
  name: string;
  cloneName?: string;
  code: string;
  type: string;
  status: string;
  displayPrice: number | null;
  price: string;
  currency: string;
  description: string;
  descriptionVI: string;
  order: number;
  bought: number;
  workBasedOn: string[];
  workBasedOnVI: string[];
  imageUrl: string;
  pnl: string;
  max_drawdown: string;
  tokenFirst: string;
  tokenSecond: string;
  balance: string;
  backTest: string;
  maxDrawdownChangePercent: number;
}

export enum BotStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  COMINGSOON = 'COMINGSOON',
}
