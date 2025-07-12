import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { ProductoVentaDTO } from '../../dto/venta.dto';

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
}
