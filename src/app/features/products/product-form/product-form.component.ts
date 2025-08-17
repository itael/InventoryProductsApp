import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IceCreamProductService } from '../../../services/ice-cream-product.service';
import { CreateIceCreamProductDto, UpdateIceCreamProductDto, UnitOfMeasurement, IceCreamProduct } from '../../../models/ice-cream-product.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  productId: string | null = null;
  unitOptions = Object.values(UnitOfMeasurement);

  constructor(
    private fb: FormBuilder,
    private productService: IceCreamProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      account: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3}$/)]],
      originalPrice: ['', [Validators.required, Validators.min(0.01)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      unitOfMeasurement: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }

    // Calculate price when originalPrice or discount changes
    this.productForm.get('originalPrice')?.valueChanges.subscribe(() => this.calculatePrice());
    this.productForm.get('discount')?.valueChanges.subscribe(() => this.calculatePrice());
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            account: product.account,
            originalPrice: product.originalPrice,
            discount: product.discount,
            unitOfMeasurement: product.unitOfMeasurement
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  calculatePrice(): number {
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    const discount = this.productForm.get('discount')?.value || 0;
    return originalPrice - (originalPrice * discount / 100);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formValue = this.productForm.value;
      
      const productData = {
        ...formValue,
        price: this.calculatePrice(),
        originalPrice: parseFloat(formValue.originalPrice),
        discount: parseFloat(formValue.discount)
      };

      const operation = this.isEditMode 
        ? this.productService.updateProduct({ id: this.productId!, ...productData } as UpdateIceCreamProductDto)
        : this.productService.createProduct(productData as CreateIceCreamProductDto);

      operation.subscribe({
        next: (product) => {
          this.isLoading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return `${fieldName} must follow format: ABC-123`;
      if (field.errors['min']) return `${fieldName} must be greater than ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} must be less than ${field.errors['max'].max}`;
    }
    return '';
  }
}
