import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InicioService } from '../../services/inicio/inicio.service';
import { VentaService, PaginatedResponse, PaginationParams } from '../../services/venta/venta.service';
import { VentaDto } from '../../dto/venta.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { DetalleVentaModalComponent } from '../detalle-venta-modal/detalle-venta-modal.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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

  // Variables para paginación del servidor
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;
  isLoading = false;
  
  // Subject para debounce en el filtro
  private filterSubject = new Subject<string>();
  currentFilter = '';
  currentSort = '';
  currentDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private inicioService: InicioService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef,
    public datePipe: DatePipe,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    // No vinculamos el paginator y sort a origenDatos porque usamos paginación del servidor
    // Configuramos el debounce para el filtro
    this.filterSubject.pipe(
      debounceTime(300), // Esperar 300ms después del último evento
      distinctUntilChanged() // Solo si el valor cambió
    ).subscribe(filterValue => {
      this.currentFilter = filterValue;
      this.pageIndex = 0; // Resetear a la primera página
      this.loadVentas();
    });
  }

  ngOnInit(): void {
    // Ya no necesitamos filterPredicate porque la filtración se hace en el servidor
    this.loadVentas();
  }

  loadVentas() {
    this.isLoading = true;
    
    const params: PaginationParams = {
      page: this.pageIndex,
      size: this.pageSize,
      filter: this.currentFilter
    };

    // Agregar ordenamiento si existe
    if (this.currentSort) {
      params.sort = this.currentSort;
      params.direction = this.currentDirection;
    }

    this.ventaService.getVentasPaginadas(params).subscribe({
      next: (response: PaginatedResponse<VentaDto>) => {
        this.origenDatos.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackbarService.error('Error al obtener ventas');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Método para manejar cambios de página
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVentas();
  }

  // Método para manejar cambios de ordenamiento
  onSortChange(event: Sort) {
    this.currentSort = event.active;
    this.currentDirection = event.direction === '' ? 'desc' : event.direction;
    this.pageIndex = 0; // Resetear a la primera página
    this.loadVentas();
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.filterSubject.next(valorFiltro.trim().toLowerCase());
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
