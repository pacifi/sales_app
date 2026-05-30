import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProductApi } from '../../../data/product-api';
import { CategoryApi } from '../../../data/category-api';
import { CategoryResponse } from '../../../data/category.models';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    InputNumberModule,
    AutoCompleteModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private productApi = inject(ProductApi);
  private categoryApi = inject(CategoryApi);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  $categorySuggestions = signal<CategoryResponse[]>([]);
  $isEditing = signal(false);
  private productId: string | null = null;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    code: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
    category: [null, Validators.required], // objeto CategoryResponse para el autocomplete
  });

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.$isEditing.set(true);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productApi.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          ...product,
          category: product.category, // objeto {id, name} para el autocomplete
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el producto',
        }),
    });
  }

  searchCategory(event: { query: string }) {
    this.categoryApi.getAll(0, 10, event.query).subscribe({
      next: (res) => this.$categorySuggestions.set(res.content),
      error: () => this.$categorySuggestions.set([]),
    });
  }

  submit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      categoryId: formValue.category.id,
      category: undefined,
    };
    delete payload.category;

    if (this.$isEditing() && this.productId) {
      this.productApi.update(this.productId, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Producto actualizado correctamente',
          });
          setTimeout(() => this.router.navigate(['/products/products']), 1000);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el producto',
          }),
      });
    } else {
      this.productApi.save(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Producto creado correctamente',
          });
          setTimeout(() => this.router.navigate(['/products/products']), 1000);
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el producto',
          }),
      });
    }
  }

  goBack() {
    this.router.navigate(['/products/products']);
  }
}
