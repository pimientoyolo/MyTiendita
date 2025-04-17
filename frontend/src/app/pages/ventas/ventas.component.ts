import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto, ProductoTable } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements AfterViewInit {

  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef<HTMLInputElement>;

  constructor(
    private alertService: AlertService,
    private productoService: ProductoService
  ) { }

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

  listaProductos: ProductoTable[] = [];
  codigoBarras: string = '';
  total: number = 0;

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
  }

  incrementarCantidad(producto: ProductoTable) {
    producto.cantidad ++;
    producto.subtotal = producto.cantidad * producto.producto.precioVenta;
    this.calcularTotal();
  }

  eliminarProducto(producto: ProductoTable) {
    this.listaProductos = this.listaProductos.filter(p => p !== producto);
    this.calcularTotal();
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
    this.alertService.show("Venta procesada con éxito", "success");
    this.cancelarVenta();
  }

  cancelarVenta() {
    this.listaProductos = [];
    this.total = 0;
    this.codigoBarras = '';
  }



}
