export interface Bot {
  id: string;
  name: string;
  type: string;
  botSettingId: string;
  description: string;
  workBasedOn: string[];
  status: string;
  price: string;
  currency: string;
  imageUrl: string;
  order: number;

  ownerCreated: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBot {
  name: string;
  botSettingId: string;
  type: string;
  status: string;
  price: string;
  currency: string;
  description: string;
  order: number;
  workBasedOn: string[];
  imageUrl: string;
  code: string;
}

export enum BotStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  COMINGSOON = 'COMINGSOON',
}
