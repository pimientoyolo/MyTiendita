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
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'ventas',
                loadComponent: () => import('./pages/ventas/ventas.component').then(m => m.VentasComponent),
            },
            {
                path: 'entrada-producto',
                loadComponent: () => import('./pages/entrada-producto/entrada-producto.component').then(m => m.EntradaProductoComponent),
            },
            {
                path: 'crear-producto',
                loadComponent: () => import('./pages/crear-producto/crear-producto.component').then(m => m.CrearProductoComponent),
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full'
    }

];
