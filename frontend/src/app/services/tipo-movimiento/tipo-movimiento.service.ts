import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoMovimiento } from '../../models/tipo-movimiento';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimientoService {

  constructor(
    private http: HttpClient
  ) { 

  }

  private apiUrl = `${environment.apiUrl}/tipo-movimiento`;

  getSalidaEntrada(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(`${this.apiUrl}/listar/salida-entrada`);
  }
}
