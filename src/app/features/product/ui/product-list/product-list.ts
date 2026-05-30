import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProductApi } from '../../data/product-api';
import { ProductResponse } from '../../data/product.models';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit, OnDestroy {
  private productApi = inject(ProductApi);
  private messageService = inject(MessageService);
  private router = inject(Router);

  $products = signal<ProductResponse[]>([]);
  $totalRecords = signal(0);

  page = 0;
  size = 10;
  searchQuery = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => {
        this.searchQuery = q;
        this.page = 0;
        this.loadProducts();
      });
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.productApi.getAll(this.page, this.size, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.$products.set(res.content);
        this.$totalRecords.set(res.totalElements);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar los productos',
        }),
    });
  }

  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchSubject.next(q);
  }

  onPageChange(event: any) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.loadProducts();
  }

  goToCreate() {
    this.router.navigate(['/products/products/create']);
  }

  goToEdit(product: ProductResponse) {
    this.router.navigate(['/products/products/edit', product.id]);
  }

  delete(product: ProductResponse) {
    this.productApi.delete(product.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Producto eliminado correctamente',
        });
        this.loadProducts();
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el producto',
        }),
    });
  }
}
