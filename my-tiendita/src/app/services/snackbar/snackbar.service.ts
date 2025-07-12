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
    duration: 300000,
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
}
