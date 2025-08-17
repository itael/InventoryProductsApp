import { Role } from './role.model';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  token: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  isActive: boolean;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  id: string;
}

export interface UserWithRole extends User {
  roleName: string;
}
