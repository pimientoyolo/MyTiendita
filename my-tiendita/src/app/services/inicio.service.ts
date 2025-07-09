import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBalanceDia(){
    return this.http.get(`${this.apiUrl}/movimiento/balance/dia`);
  }

  getBalanceSemana(){
    return this.http.get(`${this.apiUrl}/movimiento/balance/semana`);
  }

  getBalanceMes(){
    return this.http.get(`${this.apiUrl}/movimiento/balance/mes`);
  }
}
