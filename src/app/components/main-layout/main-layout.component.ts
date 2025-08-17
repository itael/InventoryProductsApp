import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationMenuComponent],
  template: `
    <div class="main-layout">
      <app-navigation-menu></app-navigation-menu>
      
      <div class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>

      <!-- Mobile menu toggle -->
      <button class="mobile-menu-toggle" 
              (click)="toggleMobileMenu()"
              [class.active]="isMobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile menu overlay -->
      <div class="mobile-menu-overlay" 
           *ngIf="isMobileMenuOpen"
           (click)="closeMobileMenu()">
      </div>
    </div>
  `,
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
