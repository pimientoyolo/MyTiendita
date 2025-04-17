import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { Unidad } from '../../models/unidad';
import { ProductoService } from '../../services/producto/producto.service';
import { UnidadService } from '../../services/unidad/unidad.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './actualizar-producto.component.html',
  styleUrl: './actualizar-producto.component.css'
})
export class ActualizarProductoComponent implements OnInit, AfterViewInit {

  @ViewChild('codigoBarrasInput') codigoBarrasInput!: ElementRef<HTMLInputElement>;

  @ViewChild('precioCompraInput', { static: false })
  precioCompraInput!: ElementRef<HTMLInputElement>;

  @ViewChild('precioVentaInput', { static: false })
  precioVentaInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;

  unidades: Unidad[] = [];

  producto!: Producto;
  codigoBarras: string = '';

  productoEncontrado = false;
  busqueda = false;


  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private unidadService: UnidadService,
    private router: Router,
    private alertService: AlertService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    // Al cargar el componente, enfocamos el input
    setTimeout(() => this.codigoBarrasInput.nativeElement.focus(), 0);
  }

  ngOnInit(): void {
    // Cargar unidades
    this.unidadService.getAll().subscribe({
      next: (data) => {
        this.unidades = data;
      },
      error: () => {
        this.alertService.show('Ocurrió un error al cargar las unidades', 'error');
      }
    });

    // Inicializar formulario
    this.construirFormulario();
  }

  construirFormulario() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      codigoBarras: ['', [Validators.required]],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      unidad: [null, Validators.required]
    });
  }

  formatPrecio(event: Event) {
    const input = event.target as HTMLInputElement;
  
    // 1) Descubro el nombre del FormControl
    const controlName = input.getAttribute('formcontrolname');
    if (!controlName) { return; }
  
    // 2) Lo obtengo del FormGroup
    const control = this.form.get(controlName);
    if (!control) { return; }
  
    // 3) Quito todo lo que no sea dígito
    const raw = input.value.replace(/\D+/g, '');
  
    // 4) Convierto a número (0 si está vacío)
    const numeric = raw ? parseInt(raw, 10) : 0;
  
    // 5) Formateo con separadores de miles según locale
    const formatted = new Intl.NumberFormat('es-CO').format(numeric);
  
    // 6) Pinto el valor formateado en el input
    input.value = formatted;
  
    // 7) Guardo el número puro en el FormControl
    control.setValue(
      numeric,
      {
        emitEvent:       false,  // no dispara valueChanges
        emitModelToViewChange: false // NO actualiza el <input> desde el control
      }
    );
  }

  buscarProducto() {
    if (this.codigoBarras.trim() === '' || this.codigoBarras == null) {
      this.alertService.show("El código de barras no puede estar vacío", 'error');
      this.busqueda = true;
      return;
    }

    this.productoService.getByCodigoBarras(this.codigoBarras).subscribe({
      next: (data) => {
        this.producto = data;
        this.form.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          codigoBarras: data.codigoBarras,
          precioCompra: data.precioCompra,
          precioVenta: data.precioVenta,
          cantidad: data.cantidad,
          unidad: data.unidad
        });

        this.productoEncontrado = true;
        this.busqueda = true;

        this.changeDetectorRef.detectChanges(); // Detectar cambios para que se aplique el formateo

        this.formatPrecio({ target: this.precioCompraInput.nativeElement } as any);
        this.formatPrecio({ target: this.precioVentaInput.nativeElement }  as any);
      },
      error: (error) => {
        this.alertService.show(error.error.message, 'error');
        this.busqueda = true;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.alertService.show('Por favor, complete todos los campos requeridos', 'error');
      this.form.markAllAsTouched();
      return;
    }
    const producto : Producto = this.form.value;

    this.productoService.actualizar(producto).subscribe({
      next: () => {
        this.alertService.show('Producto actualizado correctamente', 'success');
        this.resetForm();
        this.productoEncontrado = false;
        this.busqueda = false;
        this.codigoBarras = '';
        this.codigoBarrasInput.nativeElement.focus();
      },
      error: (error) => {
        this.alertService.show(error.error.message, 'error');
      }
    });
  }

  onCancel() {
    this.resetForm();
    this.productoEncontrado = false;
    this.busqueda = false;
    this.codigoBarras = '';
    this.codigoBarrasInput.nativeElement.focus();
  }

  resetForm() {
    this.form.reset({
      nombre: '',
      descripcion: '',
      codigoBarras: '',
      precioCompra: '',
      precioVenta: '',
      cantidad: 0,
      unidad: null
    });
  }

  compararUnidad(u1: Unidad, u2: Unidad) {
    return u1 && u2 ? u1.id === u2.id : u1 === u2;

  }

}
