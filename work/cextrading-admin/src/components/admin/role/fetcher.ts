import { post, get, deleteGW, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';
import { Permission, Role } from './interface';

export interface RawPermission {
  description: string;
  permission_id: string;
  permission_name: string;
}

export interface RawRole {
  id: string;
  role_name: string;
  root: {
    permissions: RawPermission[];
  };
  description: string;
  owner_created: string;
  created_at: string;
  updated_at: string;
}

export interface RawRoleCreate {
  permission_ids: RawPermission['permission_id'][];
  role_name: RawRole['role_name'];
  description: RawRole['description'];
}

export const createRole = (data: RawRoleCreate) => {
  return post<RawRoleCreate, Response<Role[]>>({ data })(
    API_ADMIN.ADMIN_ROLE_CREATE,
  );
};

export const updateRole = (data: RawRoleCreate, roleId: RawRole['id']) => {
  return put<RawRoleCreate, Response<Role[]>>({ data })(
    `${API_ADMIN.ADMIN_ROLE_EDIT}/${roleId}`,
  );
};

export const normalizeAdminRole = (roles: RawRole[]): Role[] => {
  return (roles || []).map((r) => ({
    id: r.id,
    roleName: r.role_name,
    root: {
      permissions: (r.root.permissions || []).map((p) => ({
        description: p?.description,
        permissionId: p?.permission_id,
        permissionName: p?.permission_name,
      })),
    },
    description: r.description,
    ownerCreated: r.owner_created,
    updatedAt: format(Number(r.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(r.created_at), 'dd/MM/yyyy'),
  }));
};

export const getAdminRoles = () => {
  return get<Response<RawRole[]>>({})(API_ADMIN.ADMIN_ROLE_LIST);
};

export const getAdminRole = (roleId: RawRole['id']) => {
  return get<Response<RawRole>>({})(`${API_ADMIN.ADMIN_ROLE_DETAIL}/${roleId}`);
};

export const normalizePermission = (
  permissions: RawPermission[],
): Permission[] => {
  return permissions.map((p) => ({
    description: p.description,
    permissionId: p.permission_id,
    permissionName: p.permission_name,
  }));
};

export const getPermissions = () => {
  return get<Response<RawPermission[]>>({})(API_ADMIN.ADMIN_PERMISSION_LIST);
};

export const deleteAdminRole = (id: RawRole['id']) => {
  return deleteGW<undefined, ResponseWithoutPayload>({})(
    `${API_ADMIN.ADMIN_ROLE_DELETE}/${id}`,
  );
};

// export const getRole = (id: RawRoleCreate['feature_id']) => {
//   return get<Response<RawRole[]>>({})(API_ADMIN.ROLE_CREATE);
// };
