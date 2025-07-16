import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { VentaService, PaginatedResponse, PaginationParams } from '../../services/venta/venta.service';
import { MovimientoDTO, TipoMovimientoDTO } from '../../dto/venta.dto';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MovimientoModalComponent, MovimientoModalData } from '../movimiento-modal/movimiento-modal.component';

@Component({
  selector: 'app-movimientos',
  standalone: false,
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss'
})
export class MovimientosComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['fecha', 'valor', 'tipoMovimiento'];
  dataSource = new MatTableDataSource<MovimientoDTO>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Paginación
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;
  loading = true;

  // Filtros
  filterValue = '';
  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private ventaService: VentaService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupFilter();
  }

  ngAfterViewInit(): void {
    // Configurar el sort inicial para mostrar primero los movimientos más recientes
    this.sort.active = 'fecha';
    this.sort.direction = 'desc';
    this.loadMovimientos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilter(): void {
    this.filterSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadMovimientos();
      });
  }

  loadMovimientos(): void {
    this.loading = true;
    
    const params: PaginationParams = {
      page: this.pageIndex,
      size: this.pageSize,
      filter: this.filterValue,
      sort: this.sort?.active || 'fecha',
      direction: this.sort?.direction || 'desc'
    };

    this.ventaService.getMovimientosPaginados(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar movimientos:', error);
          this.snackbarService.error('Error al cargar los movimientos');
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovimientos();
  }

  onSortChange(sortState: Sort): void {
    this.pageIndex = 0;
    this.loadMovimientos();
  }

  applyFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
    this.filterSubject.next(this.filterValue);
  }

  onAddMovimiento(): void {
    const dialogData: MovimientoModalData = {
      mode: 'create'
    };

    const dialogRef = this.dialog.open(MovimientoModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'movimiento-modal-dialog',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la tabla después de crear un movimiento
        this.loadMovimientos();
        this.snackbarService.exito('Movimiento creado exitosamente');
      }
    });
  }
}
