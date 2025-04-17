import { Producto } from "./producto";
import { TipoMovimiento } from "./tipo-movimiento";

export interface Movimiento {
    id: number;
    cantidad: number;
    valor: number;
    fecha: Date;
    tipoMovimiento: TipoMovimiento
    producto: Producto;
}