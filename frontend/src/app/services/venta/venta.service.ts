import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductoTable } from '../../models/producto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = `${environment.apiUrl}/venta`;

  constructor(
    private http: HttpClient
  ) { }

  /** Realiza la venta de los productos seleccionados */
  procesoVenta(productos: ProductoTable[]): Observable<Boolean> {

    return this.http.post<Boolean>(`${this.apiUrl}/proceso`, productos);
  }
}
