import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RoleService } from '../../../core/services/role.service';
import { Role, Permission } from '../../../models/role.model';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="role-form-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ isEditMode ? 'Edit Role' : 'Create New Role' }}</h1>
          <a routerLink="/roles" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Back to Roles
          </a>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading role data...</p>
      </div>

      <div class="form-section" *ngIf="!isLoading">
        <div class="form-card">
          <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
            <div class="form-section-header">
              <h3>
                <i class="fas fa-user-shield"></i>
                Role Information
              </h3>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="name">Role Name *</label>
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  formControlName="name"
                  placeholder="Enter role name"
                  [class.error]="isFieldInvalid('name')"
                >
                <div class="error-message" *ngIf="isFieldInvalid('name')">
                  <span *ngIf="roleForm.get('name')?.errors?.['required']">Role name is required</span>
                  <span *ngIf="roleForm.get('name')?.errors?.['minlength']">Role name must be at least 3 characters</span>
                </div>
              </div>

              <div class="form-group">
                <label>Status</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="isActive">
                    <span class="checkmark"></span>
                    Active Role
                  </label>
                </div>
                <div class="help-text">Inactive roles cannot be assigned to users</div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label for="description">Description *</label>
                <textarea
                  id="description"
                  class="form-control"
                  formControlName="description"
                  rows="3"
                  placeholder="Describe the role's purpose and responsibilities"
                  [class.error]="isFieldInvalid('description')"
                ></textarea>
                <div class="error-message" *ngIf="isFieldInvalid('description')">
                  <span *ngIf="roleForm.get('description')?.errors?.['required']">Description is required</span>
                  <span *ngIf="roleForm.get('description')?.errors?.['minlength']">Description must be at least 10 characters</span>
                </div>
              </div>
            </div>

            <div class="form-section-header">
              <h3>
                <i class="fas fa-key"></i>
                Permissions
              </h3>
            </div>

            <div class="permissions-grid" *ngIf="permissions$ | async as permissions">
              <div class="permission-category" *ngFor="let category of getPermissionCategories(permissions)">
                <h4>{{ category }}</h4>
                <div class="permission-list">
                  <div class="permission-item" *ngFor="let permission of getPermissionsByCategory(permissions, category)">
                    <label class="checkbox-label">
                      <input
                        type="checkbox"
                        [value]="permission.id"
                        [checked]="isPermissionSelected(permission.id)"
                        (change)="onPermissionChange(permission.id, $event)"
                      >
                      <span class="checkmark"></span>
                      <div class="permission-info">
                        <strong>{{ permission.name }}</strong>
                        <small>{{ permission.description }}</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="selected-permissions" *ngIf="selectedPermissions.length > 0">
              <h4>Selected Permissions ({{ selectedPermissions.length }})</h4>
              <div class="permission-tags">
                <span class="permission-tag" *ngFor="let permissionId of selectedPermissions">
                  {{ getPermissionName(permissionId) }}
                  <button type="button" (click)="removePermission(permissionId)" class="remove-btn">×</button>
                </span>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="roleForm.invalid || isSubmitting"
              >
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role') }}
              </button>
              <a routerLink="/roles" class="btn btn-secondary">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  roleForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  roleId: string | null = null;
  permissions$: Observable<Permission[]> = of([]);
  selectedPermissions: string[] = [];
  permissionLookup: { [key: string]: Permission } = {};

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roleForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadPermissions();
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      isActive: [true]
    });
  }

  private loadPermissions(): void {
    this.permissions$ = this.roleService.getPermissions().pipe(
      map(permissions => {
        this.permissionLookup = permissions.reduce((acc, permission) => {
          acc[permission.id] = permission;
          return acc;
        }, {} as { [key: string]: Permission });
        return permissions;
      }),
      catchError(error => {
        console.error('Error loading permissions:', error);
        return of([]);
      })
    );
  }

  private checkEditMode(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id && id !== 'new') {
          this.isEditMode = true;
          this.roleId = id;
          this.isLoading = true;
          return this.roleService.getRoleById(id);
        }
        return of(null);
      })
    ).subscribe({
      next: (role) => {
        if (role) {
          this.populateForm(role);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.isLoading = false;
        this.router.navigate(['/roles']);
      }
    });
  }

  private populateForm(role: Role): void {
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      isActive: role.isActive
    });
    // Extract permission IDs from Permission objects
    this.selectedPermissions = role.permissions.map(p => p.id);
  }

  getPermissionCategories(permissions: Permission[]): string[] {
    const categories = new Set(permissions.map(p => p.category));
    return Array.from(categories).sort();
  }

  getPermissionsByCategory(permissions: Permission[], category: string): Permission[] {
    return permissions.filter(p => p.category === category).sort((a, b) => a.name.localeCompare(b.name));
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissions.includes(permissionId);
  }

  onPermissionChange(permissionId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      if (!this.selectedPermissions.includes(permissionId)) {
        this.selectedPermissions.push(permissionId);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
  }

  removePermission(permissionId: string): void {
    this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
  }

  getPermissionName(permissionId: string): string {
    return this.permissionLookup[permissionId]?.name || permissionId;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.roleForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    this.isSubmitting = true;
    const formValue = this.roleForm.value;
    
    // Convert selected permission IDs back to Permission objects
    const selectedPermissionObjects = this.selectedPermissions
      .map(id => this.permissionLookup[id])
      .filter(p => p !== undefined);
    
    const roleData = {
      name: formValue.name,
      description: formValue.description,
      permissions: selectedPermissionObjects,
      isActive: formValue.isActive
    };

    const operation = this.isEditMode && this.roleId
      ? this.roleService.updateRole(this.roleId, roleData)
      : this.roleService.createRole(roleData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/roles']);
      },
      error: (error) => {
        console.error('Error saving role:', error);
        this.isSubmitting = false;
        alert('Failed to save role. Please try again.');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
