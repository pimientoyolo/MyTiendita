import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['snackbar']
  };

  exito(message: string, action: string =''): void {
    const config = { ...this.defaultConfig, panelClass: ['snackbar-success'] };
    this.snackBar.open(message, action, config);
  }

  error(message: string, action: string = ''): void {
    const config = { ...this.defaultConfig, panelClass: ['snackbar-error'] };
    this.snackBar.open(message, action, config);
  }

  info(message: string, action: string = ''): void {
    const config = { ...this.defaultConfig, panelClass: ['snackbar-info'] };
    this.snackBar.open(message, action, config);
  }

  vueltos(vuelto: number): void {
    const copFormatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const formattedVuelto = copFormatter.format(vuelto);
    const message = `Venta realizada, entregar vueltos de: ${formattedVuelto}`;
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration: undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-info']
    };
    this.snackBar.open(message, 'Aceptar', config);
  }
}
