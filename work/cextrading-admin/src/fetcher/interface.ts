export enum ERROR_CODE {
  SUCCESS = 'SUCCESS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export interface ResponseWithoutPayload {
  error_code: ERROR_CODE;
  message: string;
}

export interface Response<T> {
  error_code: ERROR_CODE;
  message: string;
  payload: T;
}
