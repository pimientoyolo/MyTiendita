import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoDto } from '../../dto/venta.dto';
import { ProductoService } from '../../services/producto/producto.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

export interface MovimientoProductoModalData {
  producto: ProductoDto;
}

export interface TipoMovimiento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-movimiento-producto-modal',
  standalone: false,
  templateUrl: './movimiento-producto-modal.component.html',
  styleUrl: './movimiento-producto-modal.component.scss'
})
export class MovimientoProductoModalComponent implements OnInit {

  movimientoForm!: FormGroup;
  tiposMovimiento: TipoMovimiento[] = [
    { id: 2, nombre: 'Compra (Entrada)' },
    { id: 3, nombre: 'Salida' }
  ];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<MovimientoProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MovimientoProductoModalData
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  // Inicializar formulario
  private initForm(): void {
    this.movimientoForm = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipoMovimiento: ['', [Validators.required]]
    });
  }

  // Cancelar movimiento
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Guardar movimiento
  onSave(): void {
    if (this.movimientoForm.valid) {
      const formValue = this.movimientoForm.value;
      
      this.realizarMovimiento(
        this.data.producto.codigoBarras,
        formValue.cantidad,
        Number(formValue.tipoMovimiento)
      );
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched
  private markFormGroupTouched(): void {
    Object.keys(this.movimientoForm.controls).forEach(key => {
      const control = this.movimientoForm.get(key);
      control?.markAsTouched();
    });
  }

  // Realizar movimiento del producto
  private realizarMovimiento(codigo: string, cantidad: number, idTipoMovimiento: number): void {
    this.productoService.movimientoProducto(codigo, cantidad, idTipoMovimiento).subscribe({
      next: () => {
        const tipoTexto = idTipoMovimiento === 2 ? 'entrada' : 'salida';
        this.snackbarService.exito(`Movimiento de ${tipoTexto} registrado correctamente`);
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.snackbarService.error(error.error?.message || 'Error al registrar el movimiento');
      }
    });
  }

  // Obtener el título según el tipo de movimiento
  getTitleIcon(): string {
    return 'swap_horiz';
  }

  // Formatear precio para mostrar
  formatPrecio(precio: number): string {
    if (precio === null || precio === undefined) {
      return '0';
    }
    return precio.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
