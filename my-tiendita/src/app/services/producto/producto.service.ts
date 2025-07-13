import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProductos() {
    return this.http.get(`${this.apiUrl}/producto/listar`);
  }

  getUnidades() {
    return this.http.get(`${this.apiUrl}/unidad/listar`);
  }

}
