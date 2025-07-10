export interface UnidadDto {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface ProductoDto {
    id: number;
    nombre: string;
    descripcion: string;
    codigoBarras: string;
    precioCompra: number;
    precioVenta: number;
    cantidad: number;
    unidad: UnidadDto;
}

export interface DetalleVentaDto {
    id: number;
    producto: ProductoDto;
    cantidad: number;
    valor: number;
}

export interface VentaDto {
    id: number;
    valor: number;
    fecha: string;
    detalleVentas: DetalleVentaDto[];
}