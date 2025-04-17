import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoTable } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.apiUrl}/producto`;

  constructor(
    private http: HttpClient
  ) { }

  getByCodigoBarras(codigoBarras: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigoBarras}`);
  }

  create(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/crear`, producto);
  }

  actualizar(producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/actualizar`, producto);
  }

  entradaProductos(productos: ProductoTable[]): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/entrada`, productos);
  }

  listarProductosPorIds(ids: number[]): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/listar/ids`, {
      params: { ids: ids.join(',') }
    });
  }
}
