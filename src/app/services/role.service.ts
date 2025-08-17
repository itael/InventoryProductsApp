import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Role, Permission, CreateRoleDto, UpdateRoleDto, CreatePermissionDto, UpdatePermissionDto, ResourceType, ActionType } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  private permissions: Permission[] = [
    { id: '1', name: 'Create Products', resource: ResourceType.PRODUCTS, action: ActionType.CREATE, description: 'Can create new products', category: 'Product Management' },
    { id: '2', name: 'Read Products', resource: ResourceType.PRODUCTS, action: ActionType.READ, description: 'Can view products', category: 'Product Management' },
    { id: '3', name: 'Update Products', resource: ResourceType.PRODUCTS, action: ActionType.UPDATE, description: 'Can edit products', category: 'Product Management' },
    { id: '4', name: 'Delete Products', resource: ResourceType.PRODUCTS, action: ActionType.DELETE, description: 'Can delete products', category: 'Product Management' },
    { id: '5', name: 'Create Roles', resource: ResourceType.ROLES, action: ActionType.CREATE, description: 'Can create new roles', category: 'Role Management' },
    { id: '6', name: 'Read Roles', resource: ResourceType.ROLES, action: ActionType.READ, description: 'Can view roles', category: 'Role Management' },
    { id: '7', name: 'Update Roles', resource: ResourceType.ROLES, action: ActionType.UPDATE, description: 'Can edit roles', category: 'Role Management' },
    { id: '8', name: 'Delete Roles', resource: ResourceType.ROLES, action: ActionType.DELETE, description: 'Can delete roles', category: 'Role Management' },
    { id: '9', name: 'Manage Permissions', resource: ResourceType.PERMISSIONS, action: ActionType.UPDATE, description: 'Can manage permissions', category: 'Permission Management' },
    { id: '10', name: 'View Dashboard', resource: ResourceType.DASHBOARD, action: ActionType.READ, description: 'Can access dashboard', category: 'Dashboard Access' }
  ];

  private roles: Role[] = [
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access',
      permissions: this.permissions,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Product and role management',
      permissions: this.permissions.filter(p => p.resource === ResourceType.PRODUCTS || p.resource === ResourceType.DASHBOARD),
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-08-10')
    },
    {
      id: '3',
      name: 'Employee',
      description: 'Read-only access',
      permissions: this.permissions.filter(p => p.action === ActionType.READ),
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-08-12')
    }
  ];

  private rolesSubject = new BehaviorSubject<Role[]>(this.roles);
  private permissionsSubject = new BehaviorSubject<Permission[]>(this.permissions);

  public roles$ = this.rolesSubject.asObservable();
  public permissions$ = this.permissionsSubject.asObservable();

  // Role CRUD operations
  getRoles(): Observable<Role[]> {
    return of(this.roles).pipe(delay(300));
  }

  getRole(id: string): Observable<Role | undefined> {
    return of(this.roles.find(r => r.id === id)).pipe(delay(200));
  }

  createRole(roleDto: CreateRoleDto): Observable<Role> {
    const permissions = this.permissions.filter(p => roleDto.permissionIds.includes(p.id));
    
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleDto.name,
      description: roleDto.description,
      permissions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.roles.push(newRole);
    this.rolesSubject.next([...this.roles]);

    return of(newRole).pipe(delay(500));
  }

  updateRole(roleDto: UpdateRoleDto): Observable<Role> {
    const index = this.roles.findIndex(r => r.id === roleDto.id);
    
    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }

    const permissions = roleDto.permissionIds
      ? this.permissions.filter(p => roleDto.permissionIds!.includes(p.id))
      : this.roles[index].permissions;

    const updatedRole: Role = {
      ...this.roles[index],
      ...roleDto,
      permissions,
      updatedAt: new Date()
    };

    this.roles[index] = updatedRole;
    this.rolesSubject.next([...this.roles]);

    return of(updatedRole).pipe(delay(400));
  }

  deleteRole(id: string): Observable<boolean> {
    const index = this.roles.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }

    this.roles.splice(index, 1);
    this.rolesSubject.next([...this.roles]);

    return of(true).pipe(delay(300));
  }

  // Permission CRUD operations
  getPermissions(): Observable<Permission[]> {
    return of(this.permissions).pipe(delay(300));
  }

  getPermission(id: string): Observable<Permission | undefined> {
    return of(this.permissions.find(p => p.id === id)).pipe(delay(200));
  }

  createPermission(permissionDto: CreatePermissionDto): Observable<Permission> {
    const newPermission: Permission = {
      id: Date.now().toString(),
      category: 'Custom',
      ...permissionDto
    };

    this.permissions.push(newPermission);
    this.permissionsSubject.next([...this.permissions]);

    return of(newPermission).pipe(delay(500));
  }

  updatePermission(permissionDto: UpdatePermissionDto): Observable<Permission> {
    const index = this.permissions.findIndex(p => p.id === permissionDto.id);
    
    if (index === -1) {
      return throwError(() => new Error('Permission not found'));
    }

    const updatedPermission: Permission = {
      ...this.permissions[index],
      ...permissionDto
    };

    this.permissions[index] = updatedPermission;
    this.permissionsSubject.next([...this.permissions]);

    return of(updatedPermission).pipe(delay(400));
  }

  deletePermission(id: string): Observable<boolean> {
    const index = this.permissions.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Permission not found'));
    }

    this.permissions.splice(index, 1);
    this.permissionsSubject.next([...this.permissions]);

    return of(true).pipe(delay(300));
  }
}
