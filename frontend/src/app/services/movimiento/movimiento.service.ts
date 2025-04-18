import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BalanceDTO } from '../../models/balanceDTO';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = `${environment.apiUrl}/movimiento`;

  balanceDia(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/dia`);
  }

  balanceSemana(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/semana`);
  }

  balanceMes(): Observable<BalanceDTO> {
    return this.http.get<BalanceDTO>(`${this.apiUrl}/balance/mes`);
  }
}
