import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IceCreamProductService } from '../../../services/ice-cream-product.service';
import { AuthService } from '../../../services/auth.service';
import { IceCreamProduct } from '../../../models/ice-cream-product.model';
import { Observable, finalize, Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<IceCreamProduct[]>;
  searchQuery = '';
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid'; // Nueva propiedad para el modo de vista
  private destroy$ = new Subject<void>();
  private loadingTimeout: any;

  constructor(
    private productService: IceCreamProductService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.products$ = this.productService.products$;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  loadProducts(): void {
    this.setLoading(true);
    this.startLoadingTimeout();
    
    this.productService.getProducts().pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        // This will always run whether success or error
        this.setLoading(false);
        this.clearLoadingTimeout();
      })
    ).subscribe({
      next: (products) => {
        console.log('Products loaded successfully:', products.length, 'products');
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    // Force change detection to ensure UI updates immediately
    this.cdr.detectChanges();
  }

  private startLoadingTimeout(): void {
    // Clear any existing timeout
    this.clearLoadingTimeout();
    
    // Set timeout to hide loading after 5 seconds
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.setLoading(false);
        console.log('Loading timeout reached - hiding spinner after 5 seconds');
      }
    }, 5000);
  }

  private clearLoadingTimeout(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.setLoading(true);
      this.startLoadingTimeout();
      
      this.productService.searchProducts(this.searchQuery).pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.setLoading(false);
          this.clearLoadingTimeout();
        })
      ).subscribe({
        next: (products) => {
          console.log('Search results:', products);
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (success) => {
          if (success) {
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.authService.hasPermission(permission);
  }

  calculateDiscountedPrice(originalPrice: number, discount: number): number {
    return originalPrice - (originalPrice * discount / 100);
  }

  trackByProductId(index: number, product: IceCreamProduct): string {
    return product.id;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
