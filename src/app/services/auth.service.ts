import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthUser, LoginDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      email: 'admin@inventory.com',
      firstName: 'Admin',
      lastName: 'User',
      permissions: ['products.create', 'products.read', 'products.update', 'products.delete', 
                   'roles.create', 'roles.read', 'roles.update', 'roles.delete', 
                   'permissions.update', 'dashboard.read']
    },
    {
      id: '2',
      username: 'manager',
      password: 'manager123',
      email: 'manager@inventory.com',
      firstName: 'Manager',
      lastName: 'User',
      permissions: ['products.create', 'products.read', 'products.update', 'products.delete', 'dashboard.read']
    },
    {
      id: '3',
      username: 'employee',
      password: 'employee123',
      email: 'employee@inventory.com',
      firstName: 'Employee',
      lastName: 'User',
      permissions: ['products.read', 'dashboard.read', 'roles.read']
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if user is already logged in (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(loginDto: LoginDto): Observable<AuthUser> {
    const user = this.mockUsers.find(u => 
      u.username === loginDto.username && u.password === loginDto.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions,
      token: this.generateToken()
    };

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(authUser));
    }
    this.currentUserSubject.next(authUser);

    return of(authUser).pipe(delay(1000));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user?.permissions.includes(permission) || false)
    );
  }

  hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => {
        if (!user) return false;
        return permissions.some(permission => user.permissions.includes(permission));
      })
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private generateToken(): string {
    return 'mock-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
