export interface Permission {
  description: string;
  permissionId: string;
  permissionName: string;
}
export interface Role {
  id: string;
  roleName: string;
  root: {
    permissions: Permission[];
  };
  description: string;
  ownerCreated: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateAdminRoleData {
  permissionIds: Permission['permissionId'][];
  roleName: Role['roleName'];
  description: Role['description'];
}
