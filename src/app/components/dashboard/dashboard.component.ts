import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IceCreamProductService } from '../../services/ice-cream-product.service';
import { RoleService } from '../../core/services/role.service';
import { UserService } from '../../core/services/user.service';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { IceCreamProduct } from '../../models/ice-cream-product.model';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';
import { Observable, combineLatest, map } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface DashboardStats {
  totalProducts: number;
  totalRoles: number;
  totalUsers: number;
  totalRevenue: number;
  averageDiscount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuBarComponent, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats$: Observable<DashboardStats>;
  recentProducts$: Observable<IceCreamProduct[]>;
  currentUser$: Observable<any>;

  constructor(
    private authService: AuthService,
    private productService: IceCreamProductService,
    private roleService: RoleService,
    private userService: UserService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    
    this.stats$ = combineLatest([
      this.productService.getProducts(),
      this.roleService.getRoles(),
      this.userService.getUsers()
    ]).pipe(
      map(([products, roles, users]: [IceCreamProduct[], Role[], User[]]) => ({
        totalProducts: products.length,
        totalRoles: roles.length,
        totalUsers: users.length,
        totalRevenue: products.reduce((sum: number, product: IceCreamProduct) => sum + product.price, 0),
        averageDiscount: products.reduce((sum: number, product: IceCreamProduct) => sum + product.discount, 0) / products.length || 0
      }))
    );

    this.recentProducts$ = this.productService.getProducts().pipe(
      map((products: IceCreamProduct[]) => products
        .sort((a: IceCreamProduct, b: IceCreamProduct) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
        .slice(0, 5)
      )
    );
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      // This will be handled by the auth guard in production
    }
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.authService.hasPermission(permission);
  }
}
