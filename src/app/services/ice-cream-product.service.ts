import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  IceCreamProduct, 
  CreateIceCreamProductDto, 
  UpdateIceCreamProductDto, 
  UnitOfMeasurement 
} from '../models/ice-cream-product.model';

@Injectable({
  providedIn: 'root'
})
export class IceCreamProductService {
  private products: IceCreamProduct[] = [
    {
      id: '1',
      name: 'Vanilla Supreme',
      description: 'Premium vanilla ice cream made with real vanilla beans',
      account: 'PRD-001',
      price: 12.99,
      originalPrice: 15.99,
      discount: 18.8,
      unitOfMeasurement: UnitOfMeasurement.LITER,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-10')
    },
    {
      id: '2',
      name: 'Chocolate Fudge',
      description: 'Rich chocolate ice cream with fudge swirl',
      account: 'PRD-002',
      price: 14.99,
      originalPrice: 17.99,
      discount: 16.7,
      unitOfMeasurement: UnitOfMeasurement.LITER,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-08-12')
    },
    {
      id: '3',
      name: 'Strawberry Delight',
      description: 'Fresh strawberry ice cream with real fruit pieces',
      account: 'PRD-003',
      price: 13.99,
      originalPrice: 16.99,
      discount: 17.6,
      unitOfMeasurement: UnitOfMeasurement.PINT,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-08-14')
    }
  ];

  private productsSubject = new BehaviorSubject<IceCreamProduct[]>(this.products);
  public products$ = this.productsSubject.asObservable();

  getProducts(): Observable<IceCreamProduct[]> {
    // Actualizar el BehaviorSubject con los datos actuales
    this.productsSubject.next([...this.products]);
    return of(this.products).pipe(delay(300));
  }

  getProduct(id: string): Observable<IceCreamProduct | undefined> {
    return of(this.products.find(p => p.id === id)).pipe(delay(200));
  }

  createProduct(productDto: CreateIceCreamProductDto): Observable<IceCreamProduct> {
    const newProduct: IceCreamProduct = {
      ...productDto,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
    
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(productDto: UpdateIceCreamProductDto): Observable<IceCreamProduct> {
    const index = this.products.findIndex(p => p.id === productDto.id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct: IceCreamProduct = {
      ...this.products[index],
      ...productDto,
      updatedAt: new Date()
    };

    this.products[index] = updatedProduct;
    this.productsSubject.next([...this.products]);

    return of(updatedProduct).pipe(delay(500));
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(300));
    }

    this.products.splice(index, 1);
    this.productsSubject.next([...this.products]);

    return of(true).pipe(delay(300));
  }

  searchProducts(query: string): Observable<IceCreamProduct[]> {
    const filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.account.toLowerCase().includes(query.toLowerCase())
    );

    // Actualizar el BehaviorSubject con los resultados filtrados
    this.productsSubject.next([...filtered]);
    return of(filtered).pipe(delay(300));
  }
}
