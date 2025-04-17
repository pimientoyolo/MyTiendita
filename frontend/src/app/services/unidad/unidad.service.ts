import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Unidad } from '../../models/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private apiUrl = `${environment.apiUrl}/unidad`;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(`${this.apiUrl}/listar`);
  }
}
