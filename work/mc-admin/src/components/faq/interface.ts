/* eslint-disable no-unused-vars */
import { Key } from 'react';

export enum STATUS {
  ON = 'ON',
  OFF = 'OFF',
}

export interface Faq {
  id: string;
  status: STATUS;
  data: {
    translation: {
      vi: {
        name: string;
        answer: string;
      };
      en: {
        name: string;
        answer: string;
      };
    };
  };
  additional_data_id: string;
  created_at: string;
}

export interface FaqOfDataMap {
  key: Key;
  status: STATUS;
  data: {
    translation: {
      vi: {
        name: string;
        answer: string;
      };
      en: {
        name: string;
        answer: string;
      };
    };
  };
  additional_data_id: string;
  created_at: string;
}

export interface FaqStatusUpdate {
  id: Key;
  additional_data_id: string;
  status: STATUS;
}
