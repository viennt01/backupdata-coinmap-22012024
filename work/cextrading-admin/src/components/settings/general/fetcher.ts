import { post, get, put, deleteGW } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';

import { General } from './interface';

export interface RawGeneral {
  general_setting_id: string;
  general_setting_name: string;
  description: string;
  val_limit: number;
  owner_created: string;
  created_at: string;
  updated_at: string;
}

export interface RawGeneralCreate {
  general_setting_id: RawGeneral['general_setting_id'];
  general_setting_name: RawGeneral['general_setting_name'];
  description: RawGeneral['description'];
}

export const createGeneral = (data: RawGeneralCreate[]) => {
  return post<{ general_settings: RawGeneralCreate[] }, Response<RawGeneral[]>>(
    {
      data: { general_settings: data },
    },
  )(API_ADMIN.GENERAL_CREATE);
};

export const editGeneral = (data: RawGeneralCreate) => {
  return put<RawGeneralCreate, Response<RawGeneral[]>>({ data })(
    API_ADMIN.GENERAL_EDIT,
  );
};

export const normalizeGeneral = (generals: RawGeneral[]): General[] => {
  return generals.map((g) => ({
    generalSettingId: g.general_setting_id,
    generalSettingName: g.general_setting_name,
    valLimit: g.val_limit,
    description: g.description,
    ownerCreated: g.owner_created,
    updatedAt: format(Number(g.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(g.created_at), 'dd/MM/yyyy'),
  }));
};

export const getGenerals = () => {
  return get<Response<RawGeneral[]>>({})(API_ADMIN.GENERAL_LIST);
};

export const deleteGeneral = (id: RawGeneralCreate['general_setting_id']) => {
  return deleteGW<
    { id: RawGeneralCreate['general_setting_id'] },
    Response<General[]>
  >({
    data: { id },
  })(`${API_ADMIN.GENERAL_DELETE}/${id}`);
};

export const getGeneral = (id: RawGeneralCreate['general_setting_id']) => {
  return get<Response<RawGeneral>>({})(`${API_ADMIN.GENERAL_DETAIL}/${id}`);
};
