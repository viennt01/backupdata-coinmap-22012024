import { get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import { PackageTime } from './interface';

export interface RawPackageTime {
  id: string;
  name: string;
  discount_rate: number;
  discount_amount: number;
  status: boolean;
  quantity: number;
  owner_created: string;
  type: string;
  created_at: number;
  updated_at: number;
}

export interface RawPackageTimeCreate {
  name: string;
  discount_rate: number;
  discount_amount: number;
  status: boolean;
  quantity: number;
  type: string;
}

export const normalizePackageTime = (
  rawPackage: RawPackageTime,
): PackageTime => {
  const user: PackageTime = {
    id: rawPackage.id,
    name: rawPackage.name,
    discountRate: rawPackage.discount_rate,
    discountAmount: rawPackage.discount_amount,
    status: rawPackage.status,
    quantity: rawPackage.quantity,
    ownerCreated: rawPackage.owner_created,
    type: rawPackage.type,
    updatedAt: format(Number(rawPackage.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(rawPackage.created_at), 'dd/MM/yyyy'),
  };

  return user;
};

export const createPackageTime = (data: RawPackageTimeCreate) => {
  return post<RawPackageTimeCreate, Response<RawPackageTime>>({ data })(
    API_ADMIN.PACKAGE_CREATE,
  );
};

export const getPackageTimeList = () => {
  return get<Response<RawPackageTime[]>>({})(API_ADMIN.PACKAGE_LIST);
};

export const getPackageTime = (id: RawPackageTime['id']) => {
  return get<Response<RawPackageTime>>({})(`${API_ADMIN.PACKAGE_DETAIL}/${id}`);
};

export const updatePackageTime = (
  id: RawPackageTime['id'],
  data: RawPackageTimeCreate,
) => {
  return put<RawPackageTimeCreate, Response<RawPackageTime>>({ data })(
    `${API_ADMIN.PACKAGE_EDIT}/${id}`,
  );
};
