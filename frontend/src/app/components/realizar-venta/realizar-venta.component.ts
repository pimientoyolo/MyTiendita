import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductoDto, ProductoVentaDTO } from '../../dto/venta.dto';
import { MatTableDataSource } from '@angular/material/table';
import { VentaService } from '../../services/venta/venta.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-realizar-venta',
  standalone: false,
  templateUrl: './realizar-venta.component.html',
  styleUrl: './realizar-venta.component.scss'
})
export class RealizarVentaComponent implements OnInit, AfterViewInit {
  @ViewChild('codigoInput') codigoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('montoRecibidoInput') montoRecibidoInput!: ElementRef<HTMLInputElement>;



  focusCodigoInput(): void {
    this.codigoInput.nativeElement.focus();
    this.codigoInput.nativeElement.value = '';
  }

  constructor(
    private ventaService: VentaService,
    private snackbarService: SnackbarService
  ) { }

  columnas: string[] = ['producto', 'valor', 'cantidad', 'precioVenta', 'acciones'];
  origenDatos: MatTableDataSource<ProductoVentaDTO> = new MatTableDataSource<ProductoVentaDTO>([]);
  productosVenta: ProductoVentaDTO[] = [];

  total = 0;
  montoRecibido = 0;
  vuelto = 0;
  vueltoFormateado = '';

  // Función para formatear números como COP
  formatearCOP(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  // Función para formatear números sin símbolo de moneda (solo separadores de miles)
  formatearNumero(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  // Función para limpiar formato y obtener número
  limpiarFormato(valor: string): number {
    return parseInt(valor.replace(/\./g, '')) || 0;
  }

  // Función para formatear input mientras se escribe
  formatearInput(event: any): void {
    const input = event.target;
    const valor = this.limpiarFormato(input.value);
    const valorFormateado = this.formatearNumero(valor);
    
    input.value = valorFormateado;
    this.montoRecibido = valor;
    this.calcularVuelto();
  }

  // Función para obtener la clase CSS del vuelto según si es negativo
  getVueltoClass(): string {
    return this.vuelto < 0 ? 'vuelto-negativo' : '';
  }

  // Función para validar que solo se escriban números y puntos
  validarTeclaNumerica(event: KeyboardEvent): void {
    const char = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    
    // Permitir teclas de control (backspace, delete, arrow keys, etc.)
    if (event.ctrlKey || event.metaKey || 
        ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
      return;
    }
    
    // Permitir números
    if (char >= '0' && char <= '9') {
      return;
    }
    
    // Permitir punto solo si no hay otro punto ya
    if (char === '.' && !currentValue.includes('.')) {
      return;
    }
    
    // Bloquear cualquier otra tecla
    event.preventDefault();
  }

  // Función para actualizar cantidad en tiempo real mientras se escribe
  actualizarCantidad(producto: ProductoVentaDTO, event: any): void {
    const input = event.target;
    const inputValue = input.value;
    
    // Permitir valores temporales mientras escribe (., 1., .5, etc.)
    // Solo actualizar si es un número válido o está vacío
    let nuevaCantidad: number;
    
    if (inputValue === '' || inputValue === '.') {
      // Si está vacío o solo punto, usar 0 temporalmente
      nuevaCantidad = 0;
    } else {
      const parsed = parseFloat(inputValue);
      if (isNaN(parsed) || parsed < 0) {
        // Si no es válido o negativo, no hacer nada (mantener lo que está)
        return;
      }
      nuevaCantidad = parsed;
    }
    
    // Encontrar el producto en la lista
    const index = this.productosVenta.findIndex(p => p.producto.id === producto.producto.id);
    if (index > -1) {
      // Actualizar cantidad y valor
      this.productosVenta[index].cantidad = nuevaCantidad;
      this.productosVenta[index].valor = this.productosVenta[index].producto.precioVenta * nuevaCantidad;
      
      // Actualizar la tabla
      this.origenDatos.data = [...this.productosVenta];
      this.calcularTotal();
    }
  }

  // Función para validar cantidad mínima cuando se pierde el foco
  validarCantidadMinima(producto: ProductoVentaDTO, event: any): void {
    const input = event.target;
    let cantidad = parseFloat(input.value);
    
    // Si no es un número válido o es menor o igual a 0, eliminar el producto
    if (isNaN(cantidad) || cantidad <= 0) {
      this.quitarProducto(producto);
      this.snackbarService.error('Cantidad debe ser mayor a 0. Producto eliminado.');
    } else {
      // Redondear a 2 decimales para evitar problemas de precisión
      cantidad = Math.round(cantidad * 100) / 100;
      input.value = cantidad.toString();
      
      // Actualizar si hubo cambio por el redondeo
      const index = this.productosVenta.findIndex(p => p.producto.id === producto.producto.id);
      if (index > -1 && this.productosVenta[index].cantidad !== cantidad) {
        this.productosVenta[index].cantidad = cantidad;
        this.productosVenta[index].valor = this.productosVenta[index].producto.precioVenta * cantidad;
        this.origenDatos.data = [...this.productosVenta];
        this.calcularTotal();
      }
    }
  }

  agregarProducto(codigo: string): void {

    this.focusCodigoInput();

    if (!codigo || codigo.trim() === '') {
      this.snackbarService.error('Por favor, ingrese un código de barras válido');
      return;
    }

    this.ventaService.getProducto(codigo).subscribe(
      (producto) => {
        const productoDto = producto as ProductoDto;
        let productoVenta: ProductoVentaDTO = {
          producto: productoDto,
          cantidad: 1,
          valor: productoDto.precioVenta,
        };

        // Verificar si el producto ya está en la lista
        const index = this.productosVenta.findIndex(p => p.producto.id === productoDto.id);
        if (index > -1) {
          this.productosVenta[index].cantidad += 1;
          this.productosVenta[index].valor = this.productosVenta[index].producto.precioVenta * this.productosVenta[index].cantidad;
        } else {
          // Si no está, agregarlo a la lista
          this.productosVenta.push(productoVenta);
        }

        // Actualizar la tabla de datos
        this.origenDatos.data = this.productosVenta;
        this.calcularTotal();

        this.snackbarService.exito("Producto agregado");
        
      },
      (error) => {
        this.snackbarService.error(error.error.message || 'Error al obtener el producto');
      }
    );
  }

  calcularTotal(): void {
    this.total = this.productosVenta.reduce((sum, item) => sum + item.valor, 0);
    this.calcularVuelto();
  }


  calcularVuelto(){
    this.vuelto = this.montoRecibido - this.total;
    this.vueltoFormateado = this.formatearCOP(this.vuelto);
    
    // Mostrar el vuelto formateado en consola para debug
    console.log('Vuelto calculado:', this.vueltoFormateado);
  }

  realizarVenta() {
    this.ventaService.realizarVenta(this.productosVenta).subscribe({
      next: (response) => {
        if (response) {
          this.snackbarService.vueltos(this.vuelto);
          this.productosVenta = [];
          this.origenDatos.data = [];
          this.total = 0;
          this.montoRecibido = 0;
          this.vuelto = 0;
          this.vueltoFormateado = '';
          
          // Limpiar el input formateado
          if (this.montoRecibidoInput) {
            this.montoRecibidoInput.nativeElement.value = '';
          }
          
          this.focusCodigoInput();
        }
      },
      error: (error) => {
        this.snackbarService.error(error.error.message || 'Error al realizar la venta');
      }
    });
      
  }

  ngOnInit(): void {
    this.origenDatos.data = [];
  }

  ngAfterViewInit(): void {
    this.focusCodigoInput();

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Verificar si el clic fue en elementos que NO deben activar el auto-focus
      const isCodigoInput = this.codigoInput && target === this.codigoInput.nativeElement;
      const isMontoRecibidoInput = this.montoRecibidoInput && target === this.montoRecibidoInput.nativeElement;
      const isCantidadInput = target.classList.contains('cantidad-input-simple');
      const isButton = target.closest('button') !== null;
      const isTableInteraction = target.closest('table') !== null && (isCantidadInput || isButton);
      
      // Solo hacer focus al código de barras si NO es una interacción con campos editables o botones
      if (!isCodigoInput && !isMontoRecibidoInput && !isTableInteraction) {
        this.focusCodigoInput();
      }
    });
  }

  agregarUno(producto: ProductoVentaDTO): void {
    this.focusCodigoInput();
    
    // Solo permitir agregar de uno en uno si la unidad es ID = 1
    if (producto.producto.unidad.id !== 1) {
      this.snackbarService.error('Para este producto use el campo de cantidad para modificar la cantidad');
      return;
    }
    
    const index = this.productosVenta.findIndex(p => p.producto.id === producto.producto.id);
    if (index > -1) {
      this.productosVenta[index].cantidad += 1;
      this.productosVenta[index].valor = this.productosVenta[index].producto.precioVenta * this.productosVenta[index].cantidad;
      this.origenDatos.data = this.productosVenta;
      this.calcularTotal();
    }
  }

  quitarUno(producto: ProductoVentaDTO): void {
    this.focusCodigoInput();
    
    // Solo permitir quitar de uno en uno si la unidad es ID = 1
    if (producto.producto.unidad.id !== 1) {
      this.snackbarService.error('Para este producto use el campo de cantidad para modificar la cantidad');
      return;
    }
    
    const index = this.productosVenta.findIndex(p => p.producto.id === producto.producto.id);
    if (index > -1) {
      if (this.productosVenta[index].cantidad > 1) {
        this.productosVenta[index].cantidad -= 1;
        this.productosVenta[index].valor = this.productosVenta[index].producto.precioVenta * this.productosVenta[index].cantidad;
      } else {
        this.productosVenta.splice(index, 1);
      }
      this.origenDatos.data = this.productosVenta;
      this.calcularTotal();
    }
  }

  quitarProducto(producto: ProductoVentaDTO): void {
    this.focusCodigoInput();
    const index = this.productosVenta.findIndex(p => p.producto.id === producto.producto.id);
    if (index > -1) {
      this.productosVenta.splice(index, 1);
      this.origenDatos.data = this.productosVenta;
      this.calcularTotal();
    }
  }

}
