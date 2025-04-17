import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { ProductoService } from '../../services/producto/producto.service';
import { Producto, ProductoTable } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { EntradaStateService } from '../../storage/entrada-state.service';

@Component({
  selector: 'app-entrada-producto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './entrada-producto.component.html',
  styleUrls: ['./entrada-producto.component.css']
})
export class EntradaProductoComponent implements AfterViewInit, OnInit{

  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef<HTMLInputElement>;

  listaProductos: ProductoTable[] = [];
  codigoBarras: string = '';
  total: number = 0;

  constructor(
    private alertService: AlertService,
    private productoService: ProductoService,
    private entradaStateService: EntradaStateService
  ) { }

  ngOnInit() {
    // cargar lista inicial desde el state service
    this.listaProductos = [...this.entradaStateService.productos];

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
            subtotal: actualizado.precioCompra * item.cantidad
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

  @HostListener('document:mousedown', ['$event'])
  onGlobalMouseDown() {
    
  }


  /** Captura Shift+Enter y Esc */
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'Enter') {
      // Shift+Enter → proceder venta
      this.procesoEntrada();
      event.preventDefault();
    }
    if (event.key === 'Escape') {
      // Shift+Delete → cancelar venta
      this.cancelarEntrada();
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
      productoExistente.subtotal = productoExistente.cantidad * Producto.precioCompra;

    // Si el producto no existe, lo agregamos a la lista
    } else {
      const nuevoProducto: ProductoTable = {
        producto: Producto,
        cantidad: 1,
        subtotal: Producto.precioCompra
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
      producto.subtotal = producto.cantidad * producto.producto.precioCompra;
    }else{
      this.eliminarProducto(producto);
    }
    this.calcularTotal();
    this.persistirStado();
  }

  incrementarCantidad(producto: ProductoTable) {
    producto.cantidad ++;
    producto.subtotal = producto.cantidad * producto.producto.precioCompra;
    this.calcularTotal();
    this.persistirStado();
  }

  eliminarProducto(producto: ProductoTable) {
    this.listaProductos = this.listaProductos.filter(p => p !== producto);
    this.calcularTotal();
    this.persistirStado();
  }

  calcularTotal() {
    this.total = this.listaProductos.reduce((total, producto) => total + producto.producto.precioCompra, 0);
  }

  procesoEntrada() {
    if (this.listaProductos.length === 0) {
      this.alertService.show("No hay productos en la lista", "error");
      return;
    }
    // Aquí iría la lógica para entrada de productos
    this.productoService.entradaProductos(this.listaProductos).subscribe({
      next: () => {
        this.alertService.show("Entrada procesada con exito", "success");
        this.cancelarEntrada();
      },
      error: (error) => {
        this.alertService.show(error.error.message, "error");
      }
    });
  }

  cancelarEntrada() {
    this.listaProductos = [];
    this.total = 0;
    this.codigoBarras = '';
    this.persistirStado();
  }

  private persistirStado() {
    // Guardar el estado actual de la lista de productos en el servicio de estado
    this.entradaStateService.productos = this.listaProductos;
  }

  formatCantidad(event: Event, prod: ProductoTable) {

    const input = event.target as HTMLInputElement;
    let val = input.value;
  
    // 1) Eliminar todo lo que no sea dígito o punto
    val = val.replace(/[^0-9.]/g, '');
  
    // 2) Permitir un solo punto decimal
    const parts = val.split('.');
    if (parts.length > 2) {
      // junta todo tras el primer punto
      val = parts.shift()! + '.' + parts.join('');
    }
  
    // 3) Convertir a número (floats ok), mínimo 0
    const numeric = parseFloat(val);
    prod.cantidad = isNaN(numeric) ? 0 : Math.max(0, numeric);
  
    // 4) Recalcular subtotal y total
    prod.subtotal = prod.cantidad * prod.producto.precioCompra;

    this.calcularTotal();
    this.persistirStado();
  
    // 5) Reflejar la cadena limpia en el input
    //    Si termina en punto (ej: "12."), dejamos el punto
    input.value = val;
  }
  

  
}
