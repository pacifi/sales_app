import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductRequest, ProductResponse } from './product.models';
import { PaginationModel } from '../../../shared/models/pagination-model';

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10, q?: string) {
    const params: any = { page, size };
    if (q) params['q'] = q;
    return this.http.get<PaginationModel<ProductResponse[]>>('http://localhost:8080/api/products', {
      params,
    });
  }

  getById(id: string) {
    return this.http.get<ProductResponse>('http://localhost:8080/api/products/' + id);
  }

  save(product: ProductRequest) {
    return this.http.post<ProductResponse>('http://localhost:8080/api/products', product);
  }

  update(id: string, product: ProductRequest) {
    return this.http.put<ProductResponse>('http://localhost:8080/api/products/' + id, product);
  }

  delete(id: string) {
    return this.http.delete<void>('http://localhost:8080/api/products/' + id);
  }
}
