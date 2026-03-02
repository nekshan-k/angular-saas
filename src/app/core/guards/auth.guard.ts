import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const currentUrl = state.url || '/';

    if (typeof localStorage !== 'undefined') {
      if (currentUrl === '/' || currentUrl === '') {
        const lastRoute = localStorage.getItem('last_protected_route');
        if (lastRoute) {
          return router.parseUrl(lastRoute);
        }
      } else if (currentUrl !== '/login') {
        localStorage.setItem('last_protected_route', currentUrl);
      }
    }

    return true;
  }

  router.navigate(['/login']);
  return false;
};
