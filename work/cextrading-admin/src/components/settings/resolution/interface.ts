export interface Resolution {
  id: string;
  resolutionsName: string;
  displayName: string;
  createdAt: string;
}

export interface CreateResolution {
  resolutionsName: string;
  displayName: string;
}
