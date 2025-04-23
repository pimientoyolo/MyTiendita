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
                title: 'Inicio',
            },
            {
                path: 'ventas',
                loadComponent: () => import('./pages/ventas/ventas.component').then(m => m.VentasComponent),
                title: 'Ventas',
            },
            {
                path: 'entrada-producto',
                loadComponent: () => import('./pages/entrada-producto/entrada-producto.component').then(m => m.EntradaProductoComponent),
                title: 'Entrada de Producto',
            },
            {
                path: 'crear-producto',
                loadComponent: () => import('./pages/crear-producto/crear-producto.component').then(m => m.CrearProductoComponent),
                title: 'Crear Producto',
            },
            {
                path: 'actualizar-producto',
                loadComponent: () => import('./pages/actualizar-producto/actualizar-producto.component').then(m => m.ActualizarProductoComponent),
                title: 'Actualizar Producto',
            },
            {
                path: 'movimientos-dinero',
                loadComponent: () => import('./pages/movimientos-dinero/movimientos-dinero.component').then(m => m.MovimientosDineroComponent),
                title: 'Movimientos',
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full'
    }

];
