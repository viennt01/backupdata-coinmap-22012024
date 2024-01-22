import { FEATURE_ACTIONS } from 'constants/index';
import { post, get, put, deleteGW } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';

import { Feature } from './interface';

export interface RawFeature {
  feature_id: string;
  feature_name: string;
  description: string;
  action: FEATURE_ACTIONS;
  created_at: string;
  owner_created: string;
  updated_at: string;
}

export interface RawFeatureCreate {
  feature_id: RawFeature['feature_id'];
  feature_name: RawFeature['feature_name'];
  description: RawFeature['description'];
  action: RawFeature['action'];
}

export const createFeature = (data: RawFeatureCreate[]) => {
  return post<{ features: RawFeatureCreate[] }, Response<RawFeature[]>>({
    data: { features: data },
  })(API_ADMIN.FEATURE_CREATE);
};

export const editFeature = (data: RawFeatureCreate) => {
  return put<RawFeatureCreate, Response<RawFeature[]>>({ data })(
    API_ADMIN.FEATURE_EDIT,
  );
};

export const normalizeFeature = (features: RawFeature[]): Feature[] => {
  return features.map((f) => ({
    featureId: f.feature_id,
    featureName: f.feature_name,
    description: f.description,
    action: f.action,
    createdAt: format(Number(f.created_at), 'dd/MM/yyyy'),
  }));
};

export const getFeatures = () => {
  return get<Response<RawFeature[]>>({})(API_ADMIN.FEATURE_LIST);
};

export const deleteFeature = (id: RawFeatureCreate['feature_id']) => {
  return deleteGW<{ id: RawFeatureCreate['feature_id'] }, Response<Feature[]>>({
    data: { id },
  })(`${API_ADMIN.FEATURE_DELETE}/${id}`);
};

export const getFeature = (id: RawFeatureCreate['feature_id']) => {
  return get<Response<RawFeature>>({})(`${API_ADMIN.FEATURE_DETAIL}/${id}`);
};
