import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../../core/services/role.service';
import { Role, Permission } from '../../../models/role.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="role-list-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ 'roles.title' | translate }}</h1>
          <a routerLink="/roles/new" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            {{ 'roles.addNewRole' | translate }}
          </a>
        </div>
      </div>

      <div class="content-section">
        <div class="roles-grid" *ngIf="roles$ | async as roles; else loading">
          <div class="role-card" *ngFor="let role of roles; trackBy: trackByRoleId">
            <div class="role-header">
              <div class="role-title">
                <h3>{{ role.name }}</h3>
                <span class="role-badge" [class.active]="role.isActive" [class.inactive]="!role.isActive">
                  {{ role.isActive ? ('roles.active' | translate) : ('roles.inactive' | translate) }}
                </span>
              </div>
              <div class="role-actions">
                <a [routerLink]="['/roles', role.id, 'edit']" class="btn btn-sm btn-secondary" [title]="'common.edit' | translate">
                  <i class="fas fa-edit"></i>
                </a>
                <button (click)="confirmDelete(role)" class="btn btn-sm btn-danger" [title]="'common.delete' | translate" [disabled]="role.id === 'admin'">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div class="role-body">
              <p class="role-description">{{ role.description }}</p>
              
              <div class="permissions-section">
                <h4>{{ 'roles.permissions' | translate }} ({{ role.permissions.length }})</h4>
                <div class="permissions-list">
                  <span class="permission-tag" *ngFor="let permission of role.permissions">
                    {{ formatPermissionName(permission) }}
                  </span>
                </div>
              </div>

              <div class="role-meta">
                <small class="text-muted">
                  {{ 'roles.created' | translate }}: {{ role.createdAt | date:'short' }}
                  <span *ngIf="role.updatedAt && role.updatedAt !== role.createdAt">
                    | {{ 'roles.updated' | translate }}: {{ role.updatedAt | date:'short' }}
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading">
            <div class="loading-spinner"></div>
            <p>{{ 'roles.loadingRoles' | translate }}</p>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="roleToDelete" (click)="cancelDelete()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ 'common.confirmDelete' | translate }}</h3>
          <button class="close-btn" (click)="cancelDelete()">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ 'roles.confirmDeleteMessage' | translate }} <strong>"{{ roleToDelete.name }}"</strong>?</p>
          <p class="warning-text">{{ 'roles.deleteWarning' | translate }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="cancelDelete()">{{ 'common.cancel' | translate }}</button>
          <button class="btn btn-danger" (click)="deleteRole()" [disabled]="isDeleting">
            {{ isDeleting ? ('roles.deleting' | translate) : ('roles.deleteRole' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles$: Observable<Role[]> = of([]);
  roleToDelete: Role | null = null;
  isDeleting = false;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roles$ = this.roleService.getRoles().pipe(
      catchError(error => {
        console.error('Error loading roles:', error);
        return of([]);
      })
    );
  }

  trackByRoleId(index: number, role: Role): string {
    return role.id;
  }

  formatPermissionName(permission: Permission): string {
    return permission.name;
  }

  confirmDelete(role: Role): void {
    if (role.id === 'admin') {
      alert('Cannot delete the Administrator role.');
      return;
    }
    this.roleToDelete = role;
  }

  deleteRole(): void {
    if (!this.roleToDelete) return;

    this.isDeleting = true;
    this.roleService.deleteRole(this.roleToDelete.id).subscribe({
      next: () => {
        this.roleToDelete = null;
        this.isDeleting = false;
        this.loadRoles();
      },
      error: (error) => {
        console.error('Error deleting role:', error);
        this.isDeleting = false;
        alert('Failed to delete role. Please try again.');
      }
    });
  }

  cancelDelete(): void {
    this.roleToDelete = null;
    this.isDeleting = false;
  }
}
