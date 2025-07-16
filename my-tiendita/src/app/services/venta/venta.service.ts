import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductoVentaDTO, VentaDto, MovimientoDTO } from '../../dto/venta.dto';
import { Observable } from 'rxjs';

// Interfaz para manejar la respuesta paginada del servidor
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Interfaz para los parámetros de paginación
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  filter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducto(codigoBarras  : string){
    return this.http.get(`${this.apiUrl}/producto/codigo/${codigoBarras}`);
  }

  realizarVenta(venta: ProductoVentaDTO[]) {
    return this.http.post(`${this.apiUrl}/venta/proceso`, venta);
  }

  // Método para obtener ventas paginadas
  getVentasPaginadas(params: PaginationParams): Observable<PaginatedResponse<VentaDto>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.direction) {
      httpParams = httpParams.set('direction', params.direction);
    }

    httpParams = httpParams.set('filter', params.filter ? params.filter.trim() : '');

    return this.http.get<PaginatedResponse<VentaDto>>(`${this.apiUrl}/venta/paginadas`, {
      params: httpParams
    });
  }

  // Método para obtener movimientos paginados
  getMovimientosPaginados(params: PaginationParams): Observable<PaginatedResponse<MovimientoDTO>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    if (params.direction) {
      httpParams = httpParams.set('direction', params.direction);
    }

    httpParams = httpParams.set('filter', params.filter ? params.filter.trim() : '');

    return this.http.get<PaginatedResponse<MovimientoDTO>>(`${this.apiUrl}/movimiento/paginadas`, {
      params: httpParams
    });
  }

  // Método para crear movimiento
  crearMovimiento(monto: number, idTipoMovimiento: number): Observable<void> {
    const params = new HttpParams()
      .set('monto', monto.toString())
      .set('idTipoMovimiento', idTipoMovimiento.toString());

    return this.http.post<void>(`${this.apiUrl}/movimiento/ingreso-movimiento`, null, {
      params: params
    });
  }
}
