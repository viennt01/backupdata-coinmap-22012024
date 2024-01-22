import { post, get, put, uploadFile } from '@/fetcher';
import { API_ADMIN, API_EVENT, API_GUEST } from '@/fetcher/endpoint';

// api using for authentication
export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminLoginOutput {
  error_code: string;
  message: string;
  payload: string;
}

export const userLogin = (data: AdminLoginInput) => {
  return post({ data })(API_ADMIN.LOGIN);
};

export const validateToken = () => {
  return get({})(API_EVENT.LIST + '?page=1&size=1');
};

// api using for events
export interface AdminGetEventDataOutput {
  id: string;
  name: string;
  code: string;
  status: string;
  start_at: string;
  finish_at: string;
  created_at: string;
  updated_at: string;
  attendees_number: number;
  email_remind_at: string;
  email_remind_template_id: string;
  email_confirm: boolean;
  email_confirm_template_id: string;
}

export interface PagingEventDataOutput {
  rows: AdminGetEventDataOutput[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface AdminListEventOutput {
  error_code: string;
  message: string;
  payload: PagingEventDataOutput;
}

export interface AdminGetEventOutput {
  error_code: string;
  message: string;
  payload: AdminGetEventDataOutput;
}

export interface AdminCreateEventInput {
  name: string;
  code: string;
  status: string;
  start_at: number;
  finish_at: number;
}

export interface AdminCreateEventOutput {
  error_code: string;
  message: string;
  payload: string;
}

export interface AdminUpdateEventInput {
  name: string;
  code: string;
  status: string;
  start_at: number;
  finish_at: number;
}

export interface AdminUpdateEventOutput {
  error_code: string;
  message: string;
  payload: string;
}

export const getEventList = (queryParams: string) => {
  return get({})(API_EVENT.LIST + queryParams);
};

export const getEventDetails = (id: string) => {
  return get({})(API_EVENT.MAIN + `/${id}`);
};

export const createEvent = (data: AdminCreateEventInput) => {
  return post({ data })(API_EVENT.MAIN);
};

export const updateEvent = (id: string, data: AdminUpdateEventInput) => {
  return put({ data })(API_EVENT.MAIN + `/${id}`);
};

// api using for guests
export interface AdminGetUserDataOutput {
  id: string;
  confirm_status: string;
  attend: boolean;
  fullname: string;
  email: string;
  phone: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

export interface PagingUserDataOutput {
  rows: AdminGetUserDataOutput[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface AdminListUserOutput {
  error_code: string;
  message: string;
  payload: PagingUserDataOutput;
}

export interface AdminGetUserOutput {
  error_code: string;
  message: string;
  payload: AdminGetUserDataOutput;
}

export interface AdminInviteEventInput {
  fullname: string;
  email: string | null;
  phone: string | null;
  callback_confirm_url: string;
  callback_attend_url: string;
  event_id: string;
}

export interface AdminInviteEventOutput {
  error_code: string;
  message: string;
  payload: string;
}

export interface AdminUpdateStatusInviteEventInput {
  id: string;
  confirm_status: string;
  attend: boolean;
}

export interface AdminUpdateStatusInviteEventOutput {
  error_code: string;
  message: string;
  payload: string;
}

export interface AdminInviteEventCSVInput {
  callback_confirm_url: string;
  callback_attend_url: string;
  event_id: string;
  file: FormData;
}

export interface AdminInviteEventCSVOutput {
  error_code: string;
  message: string;
  payload: {
    index: string;
    email: string;
    message: string;
  }[];
}

export const getGuestList = (queryParams: string) => {
  return get({})(API_GUEST.LIST + queryParams);
};

export const getGuestDetails = (id: string) => {
  return get({})(API_GUEST.MAIN + `/${id}`);
};

export const createGuest = (data: AdminInviteEventInput) => {
  return post({ data })(API_EVENT.INVITE);
};

export const updateGuest = (data: AdminUpdateStatusInviteEventInput) => {
  return put({ data })(API_EVENT.INVITE);
};

export const bulkCreateGuest = (data: FormData) => {
  return uploadFile({ data, timeout: 10000 })(API_EVENT.INVITE_CSV);
};
