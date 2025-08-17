import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map, throwError, combineLatest } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, CreateUserDto, UpdateUserDto, UserWithRole } from '../../models/user.model';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private roleService: RoleService) {
    this.loadUsers();
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUsersWithRoles(): Observable<UserWithRole[]> {
    return combineLatest([
      this.usersSubject.asObservable(),
      this.roleService.getRoles()
    ]).pipe(
      map(([users, roles]) => {
        const roleMap = roles.reduce((acc, role) => {
          acc[role.id] = role.name;
          return acc;
        }, {} as { [key: string]: string });

        return users.map(user => ({
          ...user,
          roleName: roleMap[user.roleId] || 'Unknown Role'
        }));
      })
    );
  }

  getUserById(id: string): Observable<User | null> {
    return this.usersSubject.pipe(
      map(users => users.find(user => user.id === id) || null)
    );
  }

  createUser(userData: CreateUserDto): Observable<User> {
    const newUser: User = {
      id: this.generateId(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roleId: userData.roleId,
      isActive: userData.isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentUsers = this.usersSubject.value;
    const updatedUsers = [...currentUsers, newUser];
    this.usersSubject.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);

    return of(newUser).pipe(delay(300));
  }

  updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const existingUserIndex = currentUsers.findIndex(user => user.id === id);
    
    if (existingUserIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    const updatedUser: User = {
      ...currentUsers[existingUserIndex],
      ...userData,
      updatedAt: new Date()
    };

    const updatedUsers = [...currentUsers];
    updatedUsers[existingUserIndex] = updatedUser;
    
    this.usersSubject.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);

    return of(updatedUser).pipe(delay(300));
  }

  deleteUser(id: string): Observable<boolean> {
    const currentUsers = this.usersSubject.value;
    const userExists = currentUsers.some(user => user.id === id);
    
    if (!userExists) {
      return throwError(() => new Error('User not found'));
    }

    const updatedUsers = currentUsers.filter(user => user.id !== id);
    this.usersSubject.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);

    return of(true).pipe(delay(300));
  }

  checkUsernameExists(username: string, excludeUserId?: string): Observable<boolean> {
    return this.usersSubject.pipe(
      map(users => {
        return users.some(user => 
          user.username.toLowerCase() === username.toLowerCase() && 
          user.id !== excludeUserId
        );
      })
    );
  }

  checkEmailExists(email: string, excludeUserId?: string): Observable<boolean> {
    return this.usersSubject.pipe(
      map(users => {
        return users.some(user => 
          user.email.toLowerCase() === email.toLowerCase() && 
          user.id !== excludeUserId
        );
      })
    );
  }

  private loadUsers(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.usersSubject.next(this.getDefaultUsers());
      return;
    }

    const savedUsers = localStorage.getItem('inventory_users');
    if (savedUsers) {
      try {
        const users: User[] = JSON.parse(savedUsers).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
        }));
        this.usersSubject.next(users);
      } catch {
        this.usersSubject.next(this.getDefaultUsers());
      }
    } else {
      const defaultUsers = this.getDefaultUsers();
      this.usersSubject.next(defaultUsers);
      this.saveUsersToStorage(defaultUsers);
    }
  }

  private saveUsersToStorage(users: User[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('inventory_users', JSON.stringify(users));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getDefaultUsers(): User[] {
    const now = new Date();
    return [
      {
        id: 'admin-user',
        username: 'admin',
        email: 'admin@inventory.com',
        firstName: 'System',
        lastName: 'Administrator',
        roleId: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lastLoginAt: now
      },
      {
        id: 'manager-user',
        username: 'manager',
        email: 'manager@inventory.com',
        firstName: 'Store',
        lastName: 'Manager',
        roleId: 'manager',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lastLoginAt: new Date(now.getTime() - 86400000) // 1 day ago
      },
      {
        id: 'employee-user',
        username: 'employee',
        email: 'employee@inventory.com',
        firstName: 'Store',
        lastName: 'Employee',
        roleId: 'employee',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        lastLoginAt: new Date(now.getTime() - 3600000) // 1 hour ago
      }
    ];
  }
}
