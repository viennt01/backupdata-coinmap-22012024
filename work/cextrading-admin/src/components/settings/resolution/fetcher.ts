import { deleteGW, get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';

import { Resolution } from './interface';

export interface RawResolution {
  id: string;
  resolutions_name: string;
  display_name: string;
  created_at: string;
}

export interface RawResolutionCreate {
  resolutions_name: string;
  display_name: string;
}

export const normalizeResolution = (
  resolutions: RawResolution[],
): Resolution[] => {
  return resolutions.map((r) => ({
    id: r.id,
    resolutionsName: r.resolutions_name,
    displayName: r.display_name,
    createdAt: format(Number(r.created_at), 'dd/MM/yyyy'),
  }));
};

export const getResolutions = () => {
  return get<Response<RawResolution[]>>({})(API_ADMIN.RESOLUTION_LIST);
};

export const createResolution = (data: RawResolutionCreate[]) => {
  return post<
    {
      resolutions: RawResolutionCreate[];
    },
    Response<RawResolution>
  >({
    data: {
      resolutions: data,
    },
  })(API_ADMIN.RESOLUTION_CREATE);
};

export const deleteResolution = (
  resolutionName: Resolution['resolutionsName'],
) => {
  return deleteGW<null, ResponseWithoutPayload>({})(
    `${API_ADMIN.RESOLUTION_DELETE}/${resolutionName}`,
  );
};

export const getResolution = (id: RawResolution['id']) => {
  return get<Response<RawResolution>>({})(
    `${API_ADMIN.RESOLUTION_DETAIL}/${id}`,
  );
};

export const editResolution = (
  data: RawResolutionCreate,
  id: RawResolution['id'],
) => {
  return put<RawResolutionCreate, Response<RawResolution[]>>({ data })(
    `${API_ADMIN.RESOLUTION_EDIT}/${id}`,
  );
};
