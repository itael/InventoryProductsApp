import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserWithRole } from '../../../models/user.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <div class="user-list-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ 'users.title' | translate }}</h1>
          <a routerLink="/users/new" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            {{ 'users.addNewUser' | translate }}
          </a>
        </div>
      </div>

      <div class="content-section">
        <div class="users-grid" *ngIf="users$ | async as users; else loading">
          <div class="user-card" *ngFor="let user of users; trackBy: trackByUserId">
            <div class="user-header">
              <div class="user-avatar">
                {{ getInitials(user.firstName, user.lastName) }}
              </div>
              <div class="user-info">
                <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                <p class="username">@{{ user.username }}</p>
                <p class="email">{{ user.email }}</p>
              </div>
              <div class="user-status">
                <span class="status-badge" [class.active]="user.isActive" [class.inactive]="!user.isActive">
                  {{ user.isActive ? ('users.active' | translate) : ('users.inactive' | translate) }}
                </span>
              </div>
            </div>

            <div class="user-body">
              <div class="user-role">
                <div class="role-info">
                  <span class="role-label">{{ 'users.role' | translate }}:</span>
                  <span class="role-name">{{ user.roleName }}</span>
                </div>
              </div>

              <div class="user-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar-plus"></i>
                  <span>{{ 'users.joined' | translate }} {{ user.createdAt | date:'MMM d, y' }}</span>
                </div>
                <div class="meta-item" *ngIf="user.lastLoginAt">
                  <i class="fas fa-clock"></i>
                  <span>{{ 'users.lastLogin' | translate }} {{ user.lastLoginAt | date:'MMM d, y - h:mm a' }}</span>
                </div>
                <div class="meta-item" *ngIf="!user.lastLoginAt">
                  <i class="fas fa-clock"></i>
                  <span class="text-muted">{{ 'users.neverLoggedIn' | translate }}</span>
                </div>
              </div>

              <div class="user-actions">
                <a [routerLink]="['/users', user.id, 'edit']" class="btn btn-sm btn-secondary" [title]="'common.edit' | translate">
                  <i class="fas fa-edit"></i>
                  {{ 'common.edit' | translate }}
                </a>
                <button (click)="confirmDelete(user)" class="btn btn-sm btn-danger" [title]="'common.delete' | translate" [disabled]="user.id === 'admin-user'">
                  <i class="fas fa-trash"></i>
                  {{ 'common.delete' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading">
            <div class="loading-spinner"></div>
            <p>{{ 'users.loadingUsers' | translate }}</p>
          </div>
        </ng-template>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" *ngIf="userToDelete" (click)="cancelDelete()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ 'common.confirmDelete' | translate }}</h3>
          <button class="close-btn" (click)="cancelDelete()">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ 'users.confirmDeleteMessage' | translate }} <strong>"{{ userToDelete.firstName }} {{ userToDelete.lastName }} ({{ userToDelete.username }})"</strong>?</p>
          <p class="warning-text">{{ 'users.deleteWarning' | translate }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" (click)="cancelDelete()">{{ 'common.cancel' | translate }}</button>
          <button class="btn btn-danger" (click)="deleteUser()" [disabled]="isDeleting">
            {{ isDeleting ? ('users.deleting' | translate) : ('users.deleteUser' | translate) }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<UserWithRole[]> = of([]);
  userToDelete: UserWithRole | null = null;
  isDeleting = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.userService.getUsersWithRoles().pipe(
      catchError(error => {
        console.error('Error loading users:', error);
        return of([]);
      })
    );
  }

  trackByUserId(index: number, user: UserWithRole): string {
    return user.id;
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  confirmDelete(user: UserWithRole): void {
    if (user.id === 'admin-user') {
      alert('Cannot delete the system administrator user.');
      return;
    }
    this.userToDelete = user;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeleting = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.userToDelete = null;
        this.isDeleting = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.isDeleting = false;
        alert('Failed to delete user. Please try again.');
      }
    });
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.isDeleting = false;
  }
}
