import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="main-navigation">
      <div class="nav-header">
        <h2 class="nav-title">
          <i class="fas fa-ice-cream"></i>
          Heladería Admin
        </h2>
      </div>

      <div class="nav-content">
        <!-- Dashboard -->
        <div class="nav-section">
          <a routerLink="/dashboard" 
             routerLinkActive="active" 
             class="nav-item dashboard-item">
            <i class="fas fa-chart-dashboard"></i>
            <span>Dashboard</span>
          </a>
        </div>

        <!-- Products CRUD -->
        <div class="nav-section">
          <h3 class="section-title">
            <i class="fas fa-ice-cream"></i>
            Productos
          </h3>
          <div class="nav-items">
            <a routerLink="/products" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="nav-item">
              <i class="fas fa-list"></i>
              <span>Lista de Productos</span>
            </a>
            <a routerLink="/products/create" 
               routerLinkActive="active" 
               class="nav-item create-item">
              <i class="fas fa-plus"></i>
              <span>Crear Producto</span>
            </a>
          </div>
        </div>

        <!-- Users CRUD -->
        <div class="nav-section">
          <h3 class="section-title">
            <i class="fas fa-users"></i>
            Usuarios
          </h3>
          <div class="nav-items">
            <a routerLink="/users" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="nav-item">
              <i class="fas fa-users"></i>
              <span>Lista de Usuarios</span>
            </a>
            <a routerLink="/users/create" 
               routerLinkActive="active" 
               class="nav-item create-item">
              <i class="fas fa-user-plus"></i>
              <span>Crear Usuario</span>
            </a>
          </div>
        </div>

        <!-- Roles CRUD -->
        <div class="nav-section">
          <h3 class="section-title">
            <i class="fas fa-user-shield"></i>
            Roles y Permisos
          </h3>
          <div class="nav-items">
            <a routerLink="/roles" 
               routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="nav-item">
              <i class="fas fa-shield-alt"></i>
              <span>Lista de Roles</span>
            </a>
            <a routerLink="/roles/create" 
               routerLinkActive="active" 
               class="nav-item create-item">
              <i class="fas fa-plus-circle"></i>
              <span>Crear Rol</span>
            </a>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="nav-section quick-actions">
          <h3 class="section-title">
            <i class="fas fa-bolt"></i>
            Acciones Rápidas
          </h3>
          <div class="nav-items">
            <div class="quick-action-grid">
              <a routerLink="/products/create" class="quick-action-btn product">
                <i class="fas fa-ice-cream"></i>
                <span>Nuevo Producto</span>
              </a>
              <a routerLink="/users/create" class="quick-action-btn user">
                <i class="fas fa-user-plus"></i>
                <span>Nuevo Usuario</span>
              </a>
              <a routerLink="/roles/create" class="quick-action-btn role">
                <i class="fas fa-shield-alt"></i>
                <span>Nuevo Rol</span>
              </a>
              <a routerLink="/dashboard" class="quick-action-btn dashboard">
                <i class="fas fa-chart-bar"></i>
                <span>Estadísticas</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-footer">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span>Administrador</span>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
}
