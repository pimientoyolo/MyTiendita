import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { ProductoDto } from '../../dto/venta.dto';

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

  crearProducto(producto: ProductoDto) {
    return this.http.post(`${this.apiUrl}/producto/crear`, producto);
  }

  editarProducto(producto: ProductoDto) {
    return this.http.put(`${this.apiUrl}/producto/actualizar`, producto);
  }

}
