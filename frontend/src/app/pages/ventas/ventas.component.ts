import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto, ProductoTable } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { VentaService } from '../../services/venta/venta.service';
import { VentaStateService } from '../../storage/venta-state.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements AfterViewInit, OnInit{

  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef<HTMLInputElement>;

  listaProductos: ProductoTable[] = [];
  codigoBarras: string = '';
  total: number = 0;

  constructor(
    private alertService: AlertService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private ventaStateService: VentaStateService
  ) { }

  ngOnInit() {
    // cargar lista inicial desde el state service
    this.listaProductos = [...this.ventaStateService.productos];

    const ids = this.listaProductos.map(p => p.producto.id);

    if (ids.length) {
      this.productoService.listarProductosPorIds(ids).subscribe( productos => {

        const mapProd = new Map<number, Producto>(
          productos.map(p => [p.id, p])
        );

        this.listaProductos = this.listaProductos.map(item => {
          const actualizado = mapProd.get(item.producto.id)!;
          return {
            producto: actualizado,
            cantidad: item.cantidad,
            subtotal: actualizado.precioVenta * item.cantidad
          };
        })


      })
    }

    this.calcularTotal();
    this.persistirStado();
  }

  ngAfterViewInit() {
    // Al cargar el componente, enfocamos el input
    setTimeout(() => this.codigoBarrasInput.nativeElement.focus(), 0);
  }

  refocus() {
    // Usamos setTimeout para esperar a que Angular actualice el DOM
    setTimeout(() => this.codigoBarrasInput.nativeElement.focus(), 0);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // si el click NO empezó dentro del input, devolvemos el foco
    if (!this.codigoBarrasInput.nativeElement.contains(target)) {
      // timeout 0 para que no interfiera con otros manejadores
      setTimeout(() => this.codigoBarrasInput.nativeElement.focus(), 0);
    }
  }

  /** Captura Shift+Enter y Esc */
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Enter') {
      // Shift+Enter → proceder venta
      this.procesoVenta();
      event.preventDefault();
    }
    if (event.key === 'Escape') {
      // Shift+Delete → cancelar venta
      this.cancelarVenta();
      event.preventDefault();
    }
  }

  getProductoByCodigoBarras() {
    this.codigoBarras = this.codigoBarras.trim();
    if (!this.codigoBarras || this.codigoBarras === "") {
      this.alertService.show("No se ha ingreso el codigo de barras", "error");
    }
    else {
      this.productoService.getByCodigoBarras(this.codigoBarras).subscribe({
        next: (producto) => {
          this.agregarProducto(producto);
          this.alertService.show("Producto agregado a la lista", "success");
        },
        error: (error) => {
          this.alertService.show(error.error.message, "error");
        }
      });
    }
    this.limpiarInput();
  }

  agregarProducto(Producto: Producto) {
    // Verificamos si el producto ya existe en la lista
    const productoExistente = this.listaProductos.find(p => p.producto.id === Producto.id);

    // Si el producto ya existe en la lista, solo actualizamos la cantidad y el subtotal
    if (productoExistente) {
      productoExistente.cantidad += 1;
      productoExistente.subtotal = productoExistente.cantidad * Producto.precioVenta;

    // Si el producto no existe, lo agregamos a la lista
    } else {
      const nuevoProducto: ProductoTable = {
        producto: Producto,
        cantidad: 1,
        subtotal: Producto.precioVenta
      };
      this.listaProductos.push(nuevoProducto);
    }
    this.limpiarInput();
    this.calcularTotal();
    this.persistirStado();
    
  }

  limpiarInput() {
    this.codigoBarras = '';
  }

  disminuirCantidad(producto: ProductoTable) {
    if (producto.cantidad > 1) {
      producto.cantidad --;
      producto.subtotal = producto.cantidad * producto.producto.precioVenta;
    }else{
      this.eliminarProducto(producto);
    }
    this.calcularTotal();
    this.persistirStado();
  }

  incrementarCantidad(producto: ProductoTable) {
    producto.cantidad ++;
    producto.subtotal = producto.cantidad * producto.producto.precioVenta;
    this.calcularTotal();
    this.persistirStado();
  }

  eliminarProducto(producto: ProductoTable) {
    this.listaProductos = this.listaProductos.filter(p => p !== producto);
    this.calcularTotal();
    this.persistirStado();
  }

  calcularTotal() {
    this.total = this.listaProductos.reduce((total, producto) => total + producto.subtotal, 0);
  }

  procesoVenta() {
    if (this.listaProductos.length === 0) {
      this.alertService.show("No hay productos en la lista", "error");
      return;
    }
    // Aquí iría la lógica para procesar la venta
    this.ventaService.procesoVenta(this.listaProductos).subscribe({
      next: () => {
        this.alertService.show("Venta procesada con éxito", "success");
        this.cancelarVenta();
      },
      error: (error) => {
        this.alertService.show(error.error.message, "error");
      }
    });
  }

  cancelarVenta() {
    this.listaProductos = [];
    this.total = 0;
    this.codigoBarras = '';
    this.persistirStado();
  }

  private persistirStado() {
    // Guardar el estado actual de la lista de productos en el servicio de estado
    this.ventaStateService.productos = this.listaProductos;
  }



}
