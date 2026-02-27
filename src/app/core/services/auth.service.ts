import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = '123qwe';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<{ accessToken: string; refreshToken: string }> {
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {
      const accessToken = this.generateToken();
      const refreshToken = this.generateRefreshToken();
      return of({ accessToken, refreshToken }).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.isTokenValid();
  }

  private generateToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      sub: this.VALID_USERNAME, 
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  private generateRefreshToken(): string {
    return btoa(`mock-refresh-${Date.now()}`);
  }
}
