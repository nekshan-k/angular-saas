import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/user-panel/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user-management'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/user-panel/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./features/user-panel/pages/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'ar-management',
        loadComponent: () => import('./features/user-panel/pages/ar-management/ar-management.component').then(m => m.ArManagementComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
