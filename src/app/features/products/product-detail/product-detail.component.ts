import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px;">
      <h2>🍦 Product Details</h2>
      <p>Product detail view will be implemented here.</p>
      <a routerLink="/products" style="color: #007bff; text-decoration: none;">← Back to Products</a>
    </div>
  `
})
export class ProductDetailComponent {
}
