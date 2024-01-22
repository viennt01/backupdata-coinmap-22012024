import { get, put, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';
import { Faq, FaqStatusUpdate } from './interface';

export const getFaq = () => {
  return get<undefined, ResponseWithPayload<Faq[]>>({})(
    `${API_MERCHANT.FAQ_LIST}?type=FAQ`
  );
};

export const updateFaqStatus = (data: FaqStatusUpdate[]) => {
  return put<{ data: FaqStatusUpdate[] }, ResponseWithPayload<boolean>>({
    data: {
      data,
    },
  })(API_MERCHANT.FAQ_UPDATE_STATUS);
};
