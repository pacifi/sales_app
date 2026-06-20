import { computed, Injectable, signal } from '@angular/core';
const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';
const ROLE_KEY = 'auth_role';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  $token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  $username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  $role = signal<string | null>(localStorage.getItem(ROLE_KEY));

  $isLoggedIn = computed(() => !!this.$token());
  $isUser = computed(() => this.$role() === 'ROLE_USER' || this.$role() === 'ROLE_ADMIN');
  $isAdmin = computed(() => this.$role() === 'ROLE_ADMIN');

  setSession(token: string, username: string, role: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(ROLE_KEY, role);
    this.$token.set(token);
    this.$username.set(username);
    this.$role.set(role);
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.$token.set(null);
    this.$username.set(null);
    this.$role.set(null);
  }
}
