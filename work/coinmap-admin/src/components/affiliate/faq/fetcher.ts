import { get, post, put } from '@/fetcher';
import { API_ADDITIONAL_DATA } from '@/fetcher/endpoint';
import { FAQ } from './interface';

export interface FaqCreate {
  name: string;
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
}
export interface MerchantUpdatePayment {
  status: string;
  transaction_id: string;
  description: string;
}

export interface FAQFilter {
  keyword: string;
  type?: string;
}

export const getFAQ = (filter: FAQFilter) => {
  const params = `type=FAQ&keyword=${filter.keyword}`;
  return get<FAQ>({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};

export const getFAQById = (id: string) => {
  return get({})(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};

export const createFaq = (data: FaqCreate) => {
  interface FAQData extends FaqCreate {
    type: 'FAQ';
  }
  return post<FAQData>({
    data: {
      ...data,
      type: 'FAQ',
    },
  })(API_ADDITIONAL_DATA.CREATE);
};

export interface FaqUpdate extends FaqCreate {
  id: string;
}

export const updateFaqById = (data: FaqUpdate, id: string) => {
  interface FAQData extends FaqUpdate {
    type: 'FAQ';
  }
  return put<FAQData>({
    data: {
      ...data,
      type: 'FAQ',
    },
  })(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};
