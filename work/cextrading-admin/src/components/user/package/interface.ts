export enum PACKAGE_TIME_ACTIVE {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}
export enum PACKAGE_TIME_TYPE {
  DAY = 'DAY',
  MONTH = 'MONTH',
}
export enum UPDATE_TYPE {
  ADD_ROLE = 'ADD_ROLE',
  REMOVE_ROLE = 'REMOVE_ROLE',
}
export interface PackageTime {
  id: string;
  name: string;
  discountRate: number;
  discountAmount: number;
  status: boolean;
  quantity: number;
  ownerCreated: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageTime {
  name: string;
  discountRate: number;
  discountAmount: number;
  status: boolean;
  quantity: number;
  type: string;
}
