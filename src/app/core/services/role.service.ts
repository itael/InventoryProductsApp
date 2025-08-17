import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Role, Permission } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private platformId = inject(PLATFORM_ID);
  private rolesSubject = new BehaviorSubject<Role[]>([]);
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);

  constructor() {
    this.loadRoles();
    this.loadPermissions();
  }

  // Roles operations
  getRoles(): Observable<Role[]> {
    return this.rolesSubject.asObservable();
  }

  getRoleById(id: string): Observable<Role | null> {
    return this.rolesSubject.pipe(
      map(roles => roles.find(role => role.id === id) || null)
    );
  }

  createRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Observable<Role> {
    const newRole: Role = {
      id: this.generateId(),
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentRoles = this.rolesSubject.value;
    const updatedRoles = [...currentRoles, newRole];
    this.rolesSubject.next(updatedRoles);
    this.saveRolesToStorage(updatedRoles);

    return of(newRole).pipe(delay(300));
  }

  updateRole(id: string, roleData: Partial<Omit<Role, 'id' | 'createdAt'>>): Observable<Role> {
    const currentRoles = this.rolesSubject.value;
    const existingRoleIndex = currentRoles.findIndex(role => role.id === id);
    
    if (existingRoleIndex === -1) {
      return throwError(() => new Error('Role not found'));
    }

    const updatedRole: Role = {
      ...currentRoles[existingRoleIndex],
      ...roleData,
      updatedAt: new Date()
    };

    const updatedRoles = [...currentRoles];
    updatedRoles[existingRoleIndex] = updatedRole;
    
    this.rolesSubject.next(updatedRoles);
    this.saveRolesToStorage(updatedRoles);

    return of(updatedRole).pipe(delay(300));
  }

  deleteRole(id: string): Observable<boolean> {
    const currentRoles = this.rolesSubject.value;
    const roleExists = currentRoles.some(role => role.id === id);
    
    if (!roleExists) {
      return throwError(() => new Error('Role not found'));
    }

    const updatedRoles = currentRoles.filter(role => role.id !== id);
    this.rolesSubject.next(updatedRoles);
    this.saveRolesToStorage(updatedRoles);

    return of(true).pipe(delay(300));
  }

  // Permissions operations
  getPermissions(): Observable<Permission[]> {
    return this.permissionsSubject.asObservable();
  }

  getPermissionsByIds(ids: string[]): Observable<Permission[]> {
    return this.permissionsSubject.pipe(
      map(permissions => permissions.filter(permission => ids.includes(permission.id)))
    );
  }

  createPermission(permissionData: Omit<Permission, 'id'>): Observable<Permission> {
    const newPermission: Permission = {
      id: this.generateId(),
      ...permissionData
    };

    const currentPermissions = this.permissionsSubject.value;
    const updatedPermissions = [...currentPermissions, newPermission];
    this.permissionsSubject.next(updatedPermissions);
    this.savePermissionsToStorage(updatedPermissions);

    return of(newPermission).pipe(delay(300));
  }

  updatePermission(id: string, permissionData: Partial<Omit<Permission, 'id'>>): Observable<Permission> {
    const currentPermissions = this.permissionsSubject.value;
    const existingPermissionIndex = currentPermissions.findIndex(permission => permission.id === id);
    
    if (existingPermissionIndex === -1) {
      return throwError(() => new Error('Permission not found'));
    }

    const updatedPermission: Permission = {
      ...currentPermissions[existingPermissionIndex],
      ...permissionData
    };

    const updatedPermissions = [...currentPermissions];
    updatedPermissions[existingPermissionIndex] = updatedPermission;
    
    this.permissionsSubject.next(updatedPermissions);
    this.savePermissionsToStorage(updatedPermissions);

    return of(updatedPermission).pipe(delay(300));
  }

  deletePermission(id: string): Observable<boolean> {
    const currentPermissions = this.permissionsSubject.value;
    const permissionExists = currentPermissions.some(permission => permission.id === id);
    
    if (!permissionExists) {
      return throwError(() => new Error('Permission not found'));
    }

    const updatedPermissions = currentPermissions.filter(permission => permission.id !== id);
    this.permissionsSubject.next(updatedPermissions);
    this.savePermissionsToStorage(updatedPermissions);

    return of(true).pipe(delay(300));
  }

  private loadRoles(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.rolesSubject.next(this.getDefaultRoles());
      return;
    }

    const savedRoles = localStorage.getItem('inventory_roles');
    if (savedRoles) {
      try {
        const roles: Role[] = JSON.parse(savedRoles);
        this.rolesSubject.next(roles);
      } catch {
        this.rolesSubject.next(this.getDefaultRoles());
      }
    } else {
      const defaultRoles = this.getDefaultRoles();
      this.rolesSubject.next(defaultRoles);
      this.saveRolesToStorage(defaultRoles);
    }
  }

  private loadPermissions(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.permissionsSubject.next(this.getDefaultPermissions());
      return;
    }

    const savedPermissions = localStorage.getItem('inventory_permissions');
    if (savedPermissions) {
      try {
        const permissions: Permission[] = JSON.parse(savedPermissions);
        this.permissionsSubject.next(permissions);
      } catch {
        this.permissionsSubject.next(this.getDefaultPermissions());
      }
    } else {
      const defaultPermissions = this.getDefaultPermissions();
      this.permissionsSubject.next(defaultPermissions);
      this.savePermissionsToStorage(defaultPermissions);
    }
  }

  private saveRolesToStorage(roles: Role[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('inventory_roles', JSON.stringify(roles));
  }

  private savePermissionsToStorage(permissions: Permission[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('inventory_permissions', JSON.stringify(permissions));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultRoles(): Role[] {
    const defaultPermissions = this.getDefaultPermissions();
    return [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full access to all features and settings',
        permissions: defaultPermissions, // Use Permission objects
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'manager',
        name: 'Manager',
        description: 'Manage products and basic operations',
        permissions: defaultPermissions.filter(p => ['products_read', 'products_write', 'products_delete', 'users_read'].includes(p.id)),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'employee',
        name: 'Employee',
        description: 'Basic access to product information',
        permissions: defaultPermissions.filter(p => ['products_read'].includes(p.id)),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  private getDefaultPermissions(): Permission[] {
    return [
      // Product permissions
      { id: 'products_read', name: 'View Products', description: 'Can view product list and details', category: 'Products', resource: 'products', action: 'read' },
      { id: 'products_write', name: 'Create/Edit Products', description: 'Can create and edit products', category: 'Products', resource: 'products', action: 'write' },
      { id: 'products_delete', name: 'Delete Products', description: 'Can delete products', category: 'Products', resource: 'products', action: 'delete' },
      
      // Role permissions
      { id: 'roles_read', name: 'View Roles', description: 'Can view roles and permissions', category: 'Roles', resource: 'roles', action: 'read' },
      { id: 'roles_write', name: 'Create/Edit Roles', description: 'Can create and edit roles', category: 'Roles', resource: 'roles', action: 'write' },
      { id: 'roles_delete', name: 'Delete Roles', description: 'Can delete roles', category: 'Roles', resource: 'roles', action: 'delete' },
      
      // User permissions
      { id: 'users_read', name: 'View Users', description: 'Can view user list and details', category: 'Users', resource: 'users', action: 'read' },
      { id: 'users_write', name: 'Create/Edit Users', description: 'Can create and edit users', category: 'Users', resource: 'users', action: 'write' },
      { id: 'users_delete', name: 'Delete Users', description: 'Can delete users', category: 'Users', resource: 'users', action: 'delete' }
    ];
  }
}
