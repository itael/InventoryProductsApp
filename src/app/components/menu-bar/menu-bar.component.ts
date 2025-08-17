import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/user.model';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, TranslatePipe],
  template: `
    <div class="menu-bar">
      <div class="menu-container">
        <!-- User Info -->
        <div class="user-info" *ngIf="currentUser$ | async as user">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="user-role">{{ user.username }}</span>
          </div>
        </div>

        <!-- Primary Navigation -->
        <div class="primary-nav">
          <a routerLink="/dashboard" 
             routerLinkActive="active" 
             class="nav-btn dashboard">
            <i class="fas fa-chart-line"></i>
            <span>{{ 'nav.dashboard' | translate }}</span>
          </a>
        </div>

        <!-- CRUD Menu Sections -->
        <div class="crud-sections">
          <!-- Products Section -->
          <div class="crud-section">
            <div class="section-label">{{ 'nav.products' | translate }}</div>
            <div class="crud-buttons">
              <a routerLink="/products" 
                 routerLinkActive="active" 
                 [routerLinkActiveOptions]="{exact: true}"
                 class="crud-btn list" 
                 title="Ver todos los productos">
                <i class="fas fa-list"></i>
                <span>Lista</span>
              </a>
              <a routerLink="/products/create" 
                 routerLinkActive="active" 
                 class="crud-btn create" 
                 title="Crear nuevo producto">
                <i class="fas fa-plus"></i>
                <span>{{ 'actions.create' | translate }}</span>
              </a>
            </div>
          </div>

          <!-- Users Section -->
          <div class="crud-section">
            <div class="section-label">{{ 'nav.users' | translate }}</div>
            <div class="crud-buttons">
              <a routerLink="/users" 
                 routerLinkActive="active" 
                 [routerLinkActiveOptions]="{exact: true}"
                 class="crud-btn list" 
                 title="Ver todos los usuarios">
                <i class="fas fa-users"></i>
                <span>{{ 'actions.list' | translate }}</span>
              </a>
              <a routerLink="/users/create" 
                 routerLinkActive="active" 
                 class="crud-btn create" 
                 title="Crear nuevo usuario">
                <i class="fas fa-user-plus"></i>
                <span>{{ 'actions.create' | translate }}</span>
              </a>
            </div>
          </div>

          <!-- Roles Section -->
          <div class="crud-section">
            <div class="section-label">{{ 'nav.roles' | translate }}</div>
            <div class="crud-buttons">
              <a routerLink="/roles" 
                 routerLinkActive="active" 
                 [routerLinkActiveOptions]="{exact: true}"
                 class="crud-btn list" 
                 title="Ver todos los roles">
                <i class="fas fa-shield-alt"></i>
                <span>{{ 'actions.list' | translate }}</span>
              </a>
              <a routerLink="/roles/create" 
                 routerLinkActive="active" 
                 class="crud-btn create" 
                 title="Crear nuevo rol">
                <i class="fas fa-plus-circle"></i>
                <span>{{ 'actions.create' | translate }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <!-- Language Selector -->
          <app-language-selector></app-language-selector>
          
          <div class="action-dropdown">
            <button class="dropdown-trigger" (click)="toggleDropdown()">
              <i class="fas fa-ellipsis-v"></i>
              <span>{{ 'nav.actions' | translate }}</span>
            </button>
            <div class="dropdown-menu" [class.show]="isDropdownOpen">
              <a routerLink="/products/create" class="dropdown-item">
                <i class="fas fa-cube"></i>
                <span>{{ 'dashboard.actions.add.product' | translate }}</span>
              </a>
              <a routerLink="/users/create" class="dropdown-item">
                <i class="fas fa-user-plus"></i>
                <span>{{ 'dashboard.actions.add.user' | translate }}</span>
              </a>
              <a routerLink="/roles/create" class="dropdown-item">
                <i class="fas fa-shield-alt"></i>
                <span>{{ 'dashboard.actions.create.role' | translate }}</span>
              </a>
              <div class="dropdown-divider"></div>
              <a routerLink="/dashboard" class="dropdown-item">
                <i class="fas fa-chart-bar"></i>
                <span>{{ 'dashboard.actions.view.stats' | translate }}</span>
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-btn" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>{{ 'nav.logout' | translate }}</span>
              </button>
            </div>
          </div>

          <!-- Direct Logout Button -->
          <button class="logout-button" (click)="logout()" title="Cerrar Sesión" *ngIf="currentUser$ | async">
            <i class="fas fa-sign-out-alt"></i>
            <span>{{ 'nav.logout' | translate }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  isDropdownOpen = false;
  currentUser$: Observable<AuthUser | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Check if user is authenticated, if not redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.authService.hasPermission(permission);
  }
}
