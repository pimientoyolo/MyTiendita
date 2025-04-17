// src/app/storage/entrada-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductoTable } from '../models/producto';

const STORAGE_KEY_ENTRADA = 'entrada-state';

@Injectable({ providedIn: 'root' })
export class EntradaStateService {
  // Inicializamos el BehaviorSubject con el valor cargado de forma segura
  private _productos$ = new BehaviorSubject<ProductoTable[]>( this._load() );
  readonly productos$ = this._productos$.asObservable();

  constructor() {
    // Solo si existe sessionStorage, nos suscribimos para escribir cambios
    if (this._hasStorage()) {
      this._productos$.subscribe(list => {
        try {
          sessionStorage.setItem(STORAGE_KEY_ENTRADA, JSON.stringify(list));
        } catch {
          // ignoramos errores (p.ej. storage lleno)
        }
      });
    }
  }

  /** Lee del storage si existe, o devuelve lista vacía */
  private _load(): ProductoTable[] {
    if (!this._hasStorage()) {
      return [];
    }
    try {
      const json = sessionStorage.getItem(STORAGE_KEY_ENTRADA);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  /** Verifica de forma segura que sessionStorage esté disponible */
  private _hasStorage(): boolean {
    return typeof window !== 'undefined'
        && typeof window.sessionStorage !== 'undefined';
  }

  /** Obtener la lista actual */
  get productos(): ProductoTable[] {
    return this._productos$.value;
  }

  /** Reemplazar la lista actual (dispara next y persistencia) */
  set productos(list: ProductoTable[]) {
    this._productos$.next(list);
  }
}
