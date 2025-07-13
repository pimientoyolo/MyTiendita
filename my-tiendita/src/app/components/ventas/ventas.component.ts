import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InicioService } from '../../services/inicio/inicio.service';
import { VentaDto } from '../../dto/venta.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DetalleVentaModalComponent } from '../detalle-venta-modal/detalle-venta-modal.component';

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit, AfterViewInit {

  columnas: string[] = ['fecha', 'valor', 'productos', 'acciones'];
  origenDatos: MatTableDataSource<VentaDto> = new MatTableDataSource<VentaDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tablaVentas: VentaDto[] = [];

  constructor(
    private inicioService: InicioService,
    private cdr: ChangeDetectorRef,
    public datePipe: DatePipe,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.origenDatos.paginator = this.paginator;
    this.origenDatos.sort = this.sort;
  }

  ngOnInit(): void {
    this.origenDatos.filterPredicate = (data: VentaDto, filter: string) => {
      const ft = filter.trim().toLowerCase();

      const fechaStr = this.datePipe
        .transform(data.fecha, "dd/MM/yyyy h:mm a")
        ?.toLowerCase() || "";

      const valorStr = data.valor.toString().toLowerCase();

      const prodsStr = data.detalleVentas
        .map(d => d.producto.nombre)
        .join(" ")
        .toLowerCase();

      const dataStr = `${fechaStr} ${valorStr} ${prodsStr}`;

      return dataStr.includes(ft);
    };

    this.fetchVentas();
  }

  fetchVentas() {
    this.inicioService.getVentasInicio().subscribe({
      next: (data) => {
        this.tablaVentas = data || [];
        this.origenDatos.data = this.tablaVentas;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackbarService.error('Error al obtener ventas');
      }
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.origenDatos.filter = valorFiltro.trim().toLowerCase();

    if (this.origenDatos.paginator) {
      this.origenDatos.paginator.firstPage();
    }
  }

  verDetalleVenta(venta: VentaDto) {
    this.dialog.open(DetalleVentaModalComponent, {
      data: venta,
      minWidth: '950px',
      maxWidth: '95vw',
      width: '950px',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'custom-dialog-container'
    });
  }
}
