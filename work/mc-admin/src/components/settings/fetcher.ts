import { get, put, uploadFile, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT, UPLOAD } from '@/fetcher/endpoint';
import { MerchantInfo } from '@/interface/merchant-info';
import {
  MerchantUpdate,
  UpdateSenderData,
  VerifySenderData,
} from './interface';

export const getMerchantInfo = () => {
  return get<undefined, ResponseWithPayload<MerchantInfo>>({})(
    API_MERCHANT.INFO
  );
};

export const updateMerchantInfo = (data: MerchantUpdate) => {
  return put<MerchantUpdate, ResponseWithPayload<MerchantInfo>>({ data })(
    API_MERCHANT.INFO
  );
};

export const uploadLogo = (data: FormData) => {
  return uploadFile({ data })(`${UPLOAD.IMAGE}`);
};

export const ACTION_UPLOAD = process.env.API_MAIN_GW + '/upload';

export const updateSender = (data: UpdateSenderData) => {
  return put({ data })(API_MERCHANT.UPDATE_SENDER);
};

export const verifySender = (data: VerifySenderData) => {
  return put({ data })(API_MERCHANT.VERIFY_SENDER);
};
