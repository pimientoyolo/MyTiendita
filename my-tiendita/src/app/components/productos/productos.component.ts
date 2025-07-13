import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductoDto } from '../../dto/venta.dto';
import { ProductoService } from '../../services/producto/producto.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private snackbarService: SnackbarService
  ) { }
  
  // Propiedades para la tabla
  origenDatos = new MatTableDataSource<ProductoDto>([]);
  columnas: string[] = ['nombre', 'precioCompra', 'precioVenta', 'cantidad', 'unidad', 'acciones'];
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Datos de ejemplo (esto normalmente vendría de un servicio)
  productos: ProductoDto[] = []

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
    this.snackbarService.info(`Editar producto: ${producto.nombre}`);
  }

  verDetalles(producto: ProductoDto): void {
    this.snackbarService.info(`Ver detalles del producto: ${producto.nombre}`);

  }

  eliminarProducto(producto: ProductoDto): void {
    this.snackbarService.info('Eliminar producto: ' + producto.nombre);
  }

  gestionarMovimiento(producto: ProductoDto): void {
    this.snackbarService.info(`Gestionar movimientos para: ${producto.nombre}`);
  }

  agregarProducto(): void {
    this.snackbarService.info('Agregar nuevo producto');
  }
}
