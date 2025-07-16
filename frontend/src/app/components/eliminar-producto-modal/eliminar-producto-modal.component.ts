import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoDto } from '../../dto/venta.dto';
import { ProductoService } from '../../services/producto/producto.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';


@Component({
  selector: 'app-eliminar-producto-modal',
  standalone: false,
  templateUrl: './eliminar-producto-modal.component.html',
  styleUrl: './eliminar-producto-modal.component.scss'
})
export class EliminarProductoModalComponent {

  constructor(
    private productoService: ProductoService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<EliminarProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoDto
  ) {}

  // Cancelar eliminación
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Confirmar eliminación
  onConfirm(): void {
    if (this.data && this.data.codigoBarras) {
      this.eliminarProducto(this.data.codigoBarras);
    }
  }

  // Método para eliminar el producto
  private eliminarProducto(codigo: string): void {
    this.productoService.eliminarProducto(codigo).subscribe({
      next: () => {
        this.snackbarService.exito('Producto eliminado correctamente');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.snackbarService.error(error.error?.message || 'Error al eliminar el producto');
      }
    });
  }
}
