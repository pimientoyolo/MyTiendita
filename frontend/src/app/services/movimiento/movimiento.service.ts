import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BalanceDTO } from '../../models/balanceDTO';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  readonly NO_CACHE = {
    headers: new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma:          'no-cache',
      Expires:         '0'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/movimiento`;

  balanceDia(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/dia`, this.NO_CACHE);
  }

  balanceSemana(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/semana`, this.NO_CACHE);
  }

  balanceMes(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/mes`, this.NO_CACHE);
  }

  createMovimiento(monto: number, idTipoMovimiento: number): Observable<void> {
    const params = new HttpParams()
      .set('monto', monto.toString())
      .set('idTipoMovimiento', idTipoMovimiento.toString());
  
    // body a null porque no estamos enviando payload JSON
    return this.http.post<void>(
      `${this.apiUrl}/ingreso-movimiento`,
      null,
      { params }
    );
  }
}
