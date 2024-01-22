import { LOCALE } from '@/constants/code-constants';

export type FormValues = {
  [locale in LOCALE]: {
    payment_policy: {
      content: string;
    };
  };
};

export interface PolicyContent {
  id: string;
  type: string;
  name: string;
  data: FormValues;
}
