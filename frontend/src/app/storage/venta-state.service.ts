import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductoTable } from '../models/producto';

const STORAGE_KEY = 'venta-state';

@Injectable({
  providedIn: 'root'
})
export class VentaStateService {

  private _productos$ = new BehaviorSubject<ProductoTable[]>(this._load());
  readonly productos$ = this._productos$.asObservable();

  constructor() { 
    // Cada vez que cambie la lista, la serializa
    this._productos$.subscribe(list => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    });
  }

  private _load(): ProductoTable[] {
    const json = sessionStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }

  get productos(): ProductoTable[] {
    return this._productos$.value;
  }

  set productos(list: ProductoTable[]) {
    this._productos$.next(list);
  }

}
