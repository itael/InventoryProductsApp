import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px;">
      <h2>🔐 Permissions Management</h2>
      <p>Permission management interface will be implemented here.</p>
      <a routerLink="/dashboard" style="color: #007bff; text-decoration: none;">← Back to Dashboard</a>
    </div>
  `
})
export class PermissionListComponent {
}
