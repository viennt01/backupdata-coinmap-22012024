import { ADDITIONAL_DATA_TYPE } from '../interface';

export interface BotFee {
  id: string;
  type: ADDITIONAL_DATA_TYPE.TBOT_FEE;
  name: string;
  data: {
    ranges: {
      from: number;
      to: number;
      percent: number;
    }[];
  };
  created_at: string;
  updated_at: string;
}
