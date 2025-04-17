import { Unidad } from "./unidad";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    codigoBarras: string;
    precioCompra : number;
    precioVenta: number;
    cantidad: number;
    unidad: Unidad;
}

export interface ProductoTable{
    producto: Producto;
    cantidad: number;
    subtotal: number;
}