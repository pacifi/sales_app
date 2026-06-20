import { Component, inject } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { AuthApi } from '../../data/auth-api';
import { AuthState } from '../../../../core/auth-state';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputText, Password, Button, ReactiveFormsModule, Toast, Card],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authApi = inject(AuthApi);
  private authState = inject(AuthState);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    console.log('llego aca');
    if (this.form.invalid) return;
    this.authApi.login(this.form.value as any).subscribe({
      next: (res) => {
        this.authState.setSession(res.token, res.username, res.role);
        this.router.navigate(['/']);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas',
        }),
    });
  }
}
