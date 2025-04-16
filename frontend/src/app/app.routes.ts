import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full'
            },
            {
                path: 'inicio',
                loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full'
    }

];
