import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';
import { User, CreateUserDto } from '../../../models/user.model';
import { Role } from '../../../models/role.model';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="user-form-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ isEditMode ? 'Edit User' : 'Create New User' }}</h1>
          <a routerLink="/users" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Back to Users
          </a>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>

      <div class="form-section" *ngIf="!isLoading">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Personal Information Section -->
            <div class="form-section-header">
              <h2><i class="fas fa-user"></i> Personal Information</h2>
            </div>

            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                formControlName="firstName"
                class="form-control"
                [class.is-invalid]="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched">
                First name is required and must be at least 2 characters
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                formControlName="lastName"
                class="form-control"
                [class.is-invalid]="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched">
                Last name is required and must be at least 2 characters
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-control"
                [class.is-invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                Please provide a valid email address
              </div>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                formControlName="phoneNumber"
                class="form-control"
                placeholder="e.g., +1-555-123-4567"
              />
            </div>

            <!-- Account Information Section -->
            <div class="form-section-header">
              <h2><i class="fas fa-key"></i> Account Information</h2>
            </div>

            <div class="form-group">
              <label for="username">Username *</label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="form-control"
                [class.is-invalid]="userForm.get('username')?.invalid && userForm.get('username')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched">
                Username is required and must be at least 3 characters
              </div>
            </div>

            <div class="form-group" *ngIf="!isEditMode">
              <label for="password">Password *</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="form-control"
                [class.is-invalid]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                Password is required and must be at least 6 characters
              </div>
            </div>

            <div class="form-group" *ngIf="!isEditMode">
              <label for="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="form-control"
                [class.is-invalid]="userForm.get('confirmPassword')?.invalid && userForm.get('confirmPassword')?.touched"
              />
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('confirmPassword')?.invalid && userForm.get('confirmPassword')?.touched">
                Passwords must match
              </div>
            </div>

            <!-- Role Assignment Section -->
            <div class="form-section-header">
              <h2><i class="fas fa-users"></i> Role Assignment</h2>
            </div>

            <div class="form-group">
              <label for="roleId">Assign Role *</label>
              <select
                id="roleId"
                formControlName="roleId"
                class="form-control"
                [class.is-invalid]="userForm.get('roleId')?.invalid && userForm.get('roleId')?.touched"
              >
                <option value="">Select a role...</option>
                <option 
                  *ngFor="let role of availableRoles$ | async" 
                  [value]="role.id"
                >
                  {{ role.name }} - {{ role.description }}
                </option>
              </select>
              <div class="invalid-feedback" 
                   *ngIf="userForm.get('roleId')?.invalid && userForm.get('roleId')?.touched">
                Please select a role for this user
              </div>
            </div>

            <!-- Status Section -->
            <div class="form-section-header">
              <h2><i class="fas fa-toggle-on"></i> Account Status</h2>
            </div>

            <div class="form-group">
              <div class="form-check">
                <input
                  id="isActive"
                  type="checkbox"
                  formControlName="isActive"
                  class="form-check-input"
                />
                <label for="isActive" class="form-check-label">
                  Account Active
                  <small class="form-text text-muted">
                    Inactive users cannot log in to the system
                  </small>
                </label>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="userForm.invalid || isSubmitting"
            >
              <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
              <i class="fas fa-save" *ngIf="!isSubmitting"></i>
              {{ isEditMode ? 'Update User' : 'Create User' }}
            </button>
            
            <a routerLink="/users" class="btn btn-secondary">
              <i class="fas fa-times"></i>
              Cancel
            </a>
          </div>
        </form>
      </div>

      <!-- Error Display -->
      <div class="alert alert-danger" *ngIf="errorMessage">
        <i class="fas fa-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .user-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .page-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2rem;
    }

    .form-grid {
      display: grid;
      gap: 20px;
    }

    .form-section-header {
      margin-top: 30px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
    }

    .form-section-header:first-child {
      margin-top: 0;
    }

    .form-section-header h2 {
      color: #495057;
      font-size: 1.25rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    .form-control {
      padding: 12px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 5px;
    }

    .form-check {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .form-check-input {
      width: 18px;
      height: 18px;
      margin-top: 2px;
    }

    .form-check-label {
      margin: 0;
      cursor: pointer;
    }

    .form-text {
      display: block;
      margin-top: 5px;
      font-size: 0.8rem;
    }

    .text-muted {
      color: #6c757d;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .loading, .alert {
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .loading {
      background-color: #f8f9fa;
      color: #495057;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-left-color: #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .fa-spin {
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .user-form-container {
        padding: 15px;
      }

      .page-header {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .header-content {
        flex-direction: column;
        gap: 15px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  currentUserId: string | null = null;
  availableRoles$: Observable<Role[]>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.availableRoles$ = this.roleService.getRoles().pipe(
      catchError(error => {
        console.error('Error loading roles:', error);
        return of([]);
      })
    );
  }

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      confirmPassword: [''],
      roleId: ['', Validators.required],
      isActive: [true]
    });

    // Add password validation for new users
    if (!this.isEditMode) {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
  }

  private checkEditMode() {
    this.currentUserId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.currentUserId;
    // TODO: Implement loadUserData when UserService.getUser is available
  }

  // TODO: Implement loadUserData when UserService.getUser is available

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formData = this.userForm.value;
      
      if (this.isEditMode) {
        this.updateUser(formData);
      } else {
        this.createUser(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createUser(userData: CreateUserDto) {
    this.userService.createUser(userData).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        this.errorMessage = 'Failed to create user. Please check your data and try again.';
        return of(null);
      })
    ).subscribe(result => {
      this.isSubmitting = false;
      
      if (result) {
        this.router.navigate(['/users']);
      }
    });
  }

  private updateUser(userData: any) {
    // TODO: Implement when UserService.updateUser signature is fixed
    this.isSubmitting = false;
    this.router.navigate(['/users']);
  }

  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
}
