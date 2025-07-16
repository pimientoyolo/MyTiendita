import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VentaDto } from '../../dto/venta.dto';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBalanceDia(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/movimiento/balance/dia`);
  }

  getBalanceSemana(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/movimiento/balance/semana`);
  }

  getBalanceMes(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/movimiento/balance/mes`);
  }

  getVentasInicio(): Observable<VentaDto[]>{
    return this.http.get<VentaDto[]>(`${this.apiUrl}/venta/listar`);
  }
}
