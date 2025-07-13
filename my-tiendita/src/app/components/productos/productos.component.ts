import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductoDto, UnidadDto } from '../../dto/venta.dto';
import { ProductoService } from '../../services/producto/producto.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { ProductoModalComponent, ProductoModalData } from '../producto-modal/producto-modal.component';
import { EliminarProductoModalComponent } from '../eliminar-producto-modal/eliminar-producto-modal.component';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }
  
  // Propiedades para la tabla
  origenDatos = new MatTableDataSource<ProductoDto>([]);
  columnas: string[] = ['nombre', 'precioCompra', 'precioVenta', 'cantidad', 'unidad', 'acciones'];
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Datos de ejemplo (esto normalmente vendría de un servicio)
  productos: ProductoDto[] = [];
  unidades: UnidadDto[] = [];

  ngOnInit(): void {
    // Configura el filtro para buscar internamente por 'unidad' además de los demás campos
    this.origenDatos.filterPredicate = (data: ProductoDto, filter: string) => {
      filter = filter.trim().toLowerCase();
      return data.nombre.toLowerCase().includes(filter) ||
             data.precioCompra.toString().includes(filter) ||
             data.precioVenta.toString().includes(filter) ||
             data.cantidad.toString().includes(filter) ||
             data.codigoBarras.toString().includes(filter) ||
             data.unidad.nombre.toLowerCase().includes(filter);
    };
    this.cargarDatos();
    this.cargarUnidades();
  }

  cargarUnidades(): void {
    this.productoService.getUnidades().subscribe({
      next: (data) => {
        this.unidades = data as UnidadDto[];
      },
      error: (error) => {
        this.snackbarService.error('Error al cargar las unidades');
      }
    });
  }


  ngAfterViewInit(): void {
    this.origenDatos.sort = this.sort;
    this.origenDatos.paginator = this.paginator;
  }

  cargarDatos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data as ProductoDto[];
        this.origenDatos.data = this.productos;
      },
      error: (error) => {
        this.snackbarService.error('Error al cargar los productos');
      }
    });
    this.origenDatos.data = this.productos;
  }

  aplicarFiltro(event: Event): void {
    const target = event.target as HTMLInputElement;
    const filterValue = target.value;
    this.origenDatos.filter = filterValue.trim().toLowerCase();

    if (this.origenDatos.paginator) {
      this.origenDatos.paginator.firstPage();
    }
  }

  editarProducto(producto: ProductoDto): void {
    const dialogRef = this.dialog.open(ProductoModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        mode: 'edit',
        producto: producto,
        unidades: this.unidades
      } as ProductoModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.exito(`Producto actualizado correctamente`);
        this.cargarDatos();
      }
    });
  }

  verDetalles(producto: ProductoDto): void {
    this.dialog.open(ProductoModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        mode: 'view',
        producto: producto,
        unidades: this.unidades
      } as ProductoModalData
    });
  }

  eliminarProducto(producto: ProductoDto): void {
    const dialogRef = this.dialog.open(EliminarProductoModalComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.exito('Producto eliminado correctamente');
        this.cargarDatos();
      }
    });
  }

  gestionarMovimiento(producto: ProductoDto): void {
    this.snackbarService.info(`Gestionar movimientos para: ${producto.nombre}`);
  }

  agregarProducto(): void {
    const dialogRef = this.dialog.open(ProductoModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        mode: 'create',
        unidades: this.unidades
      } as ProductoModalData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.exito('Producto creado correctamente');
        this.cargarDatos();
      }
    });
  }
}
