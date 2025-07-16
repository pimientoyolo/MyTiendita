export interface UnidadDto {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface ProductoDto {
    id: number | null;
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

export interface ProductoVentaDTO{
    producto: ProductoDto;
    cantidad: number;
    valor: number;
}

export interface MovimientoDTO {
    id: number;
    tipoMovimiento: TipoMovimientoDTO;
    valor: number;
    fecha: string;
}

export interface TipoMovimientoDTO {
    id: number;
    nombre: string;
    descripcion: string;
}