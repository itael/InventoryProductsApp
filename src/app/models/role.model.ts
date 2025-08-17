export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  id: string;
}

export interface CreatePermissionDto {
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface UpdatePermissionDto extends Partial<CreatePermissionDto> {
  id: string;
}

export enum ResourceType {
  PRODUCTS = 'products',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  DASHBOARD = 'dashboard',
  REPORTS = 'reports'
}

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import'
}
