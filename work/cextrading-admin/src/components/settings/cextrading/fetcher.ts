import { format } from 'date-fns';
import { get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { AppSeting } from './interface';

export interface RawAppSetting {
  created_at: string;
  description: string;
  id: string;
  name: string;
  owner_created: string;
  updated_at: string;
  value: string;
}

export const normalizeAppSetting = (
  appSettings: RawAppSetting[],
): AppSeting[] => {
  return appSettings.map((a) => ({
    description: a.description,
    id: a.id,
    name: a.name,
    ownerCreated: a.owner_created,
    value: a.value,
    updatedAt: format(Number(a.created_at), 'dd/MM/yyyy'),
    createdAt: format(Number(a.created_at), 'dd/MM/yyyy'),
  }));
};

export const getAppSettings = () => {
  return get<Response<RawAppSetting[]>>({})(API_ADMIN.APP_SETTING_LIST);
};

export interface CreateAppSetting {
  name: RawAppSetting['name'];
  value: RawAppSetting['value'];
  description: RawAppSetting['description'];
}

export const createAppSetting = (data: CreateAppSetting) => {
  return post<CreateAppSetting, Response<RawAppSetting>>({ data })(
    API_ADMIN.APP_SETTING_CREATE,
  );
};

export const updateAppSetting = (
  data: CreateAppSetting,
  id: string | undefined,
) => {
  return put<CreateAppSetting, Response<RawAppSetting>>({ data })(
    `${API_ADMIN.APP_SETTING_EDIT}/${id}`,
  );
};
