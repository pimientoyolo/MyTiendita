import { Producto } from "./producto";
import { Venta } from "./venta";

export interface DetalleVenta {
    id: number;
    cantidad: number;
    valor: number;
    producto: Producto;
    venta: Venta;
}