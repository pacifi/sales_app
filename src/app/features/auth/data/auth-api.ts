import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRegisterResponse, AuthRequest, AuthResponse } from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private http = inject(HttpClient);

  login(dto: AuthRequest) {
    return this.http.post<AuthResponse>('http://localhost:8080/api/auth/login', dto);
  }

  register(dto: AuthRequest) {
    return this.http.post<AuthRegisterResponse>('http://localhost:8080/api/auth/register', dto);
  }
}
