import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private cookieService: CookieService) {}

  setToken(token: string): void {
    this.setAccessToken(token);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  setAccessToken(token: string): void {
    this.cookieService.set(this.ACCESS_TOKEN_KEY, token, 7, '/', undefined, true, 'Strict');
  }

  setRefreshToken(token: string): void {
    this.cookieService.set(this.REFRESH_TOKEN_KEY, token, 7, '/', undefined, true, 'Strict');
  }

  getToken(): string {
    return this.getAccessToken();
  }

  getAccessToken(): string {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string {
    return this.cookieService.get(this.REFRESH_TOKEN_KEY);
  }

  removeToken(): void {
    this.removeTokens();
  }

  removeTokens(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/');
    this.cookieService.delete(this.REFRESH_TOKEN_KEY, '/');
  }

  isTokenValid(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }
}
