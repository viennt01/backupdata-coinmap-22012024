import { post } from '@/fetcher';
import { API_PUSH_NOTIFICATION } from '@/fetcher/endpoint';

export interface EmailPromotion {
  event_id?: string;
  confirm_status?: string;
  payment_status?: string;
  attend?: boolean;
}

export default function pushEmailPromotion(data: EmailPromotion) {
  return post({
    data,
  })(API_PUSH_NOTIFICATION.EMAIL);
}
