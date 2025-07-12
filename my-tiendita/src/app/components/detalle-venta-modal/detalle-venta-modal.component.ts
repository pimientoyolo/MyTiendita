import { Component, Inject, ViewChild } from '@angular/core';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef,
} from '@angular/material/dialog';
import { DetalleVentaDto, VentaDto } from '../../dto/venta.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-detalle-venta-modal',
  standalone: false,
  templateUrl: './detalle-venta-modal.component.html',
  styleUrl: './detalle-venta-modal.component.scss'
})
export class DetalleVentaModalComponent implements OnInit, AfterViewInit {

  columnas: string[] = ['producto', 'valor', 'cantidad', 'precioVenta'];
  origenDatos: MatTableDataSource<DetalleVentaDto> = new MatTableDataSource<DetalleVentaDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DetalleVentaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VentaDto
  ) { }

  ngOnInit(): void {
    this.origenDatos.filterPredicate = (data: DetalleVentaDto, filter: string) => {
      const ft = filter.trim().toLowerCase();
      
      const productoStr = data.producto.nombre.toLowerCase();
      const valorStr = data.valor.toString().toLowerCase();
      const cantidadStr = data.cantidad.toString().toLowerCase();
      const precioVentaStr = data.producto.precioVenta.toString().toLowerCase();

      const dataStr = `${productoStr} ${valorStr} ${cantidadStr} ${precioVentaStr}`;
      return dataStr.includes(ft);

    };

    this.origenDatos.data = this.data.detalleVentas;
  }

  ngAfterViewInit(): void {
    this.origenDatos.paginator = this.paginator;
    this.origenDatos.sort = this.sort;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.origenDatos.filter = valorFiltro.trim().toLowerCase();

    if (this.origenDatos.paginator) {
      this.origenDatos.paginator.firstPage();

    }
  }

}
