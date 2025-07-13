import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoDto, UnidadDto } from '../../dto/venta.dto';

export interface ProductoModalData {
  mode: 'create' | 'edit' | 'view';
  producto?: ProductoDto;
  unidades: UnidadDto[];
}

@Component({
  selector: 'app-producto-modal',
  standalone: false,
  templateUrl: './producto-modal.component.html',
  styleUrl: './producto-modal.component.scss'
})
export class ProductoModalComponent implements OnInit {

  productoForm!: FormGroup;
  unidades: UnidadDto[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoModalData
  ) {
    this.unidades = data.unidades || [];
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.producto && (this.isEditMode || this.isViewMode)) {
      this.loadProductoData();
    } else if (this.isCreateMode) {
      this.preseleccionarPrimeraUnidad();
    }
  }

  // Getters para modos
  get isCreateMode(): boolean {
    return this.data.mode === 'create';
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.data.mode === 'view';
  }

  // Inicializar formulario
  private initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: [''],
      codigoBarras: ['', [Validators.required]],
      precioCompra: [0, [Validators.required, Validators.min(0.01)]],
      precioVenta: [0, [Validators.required, Validators.min(0.01)]],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      unidadId: ['', [Validators.required]]
    });

    // Si es modo view, deshabilitar todo el formulario
    if (this.isViewMode) {
      this.productoForm.disable();
    }
  }

  // Cargar datos del producto para edición/visualización
  private loadProductoData(): void {
    if (this.data.producto) {
      const producto = this.data.producto;
      this.productoForm.patchValue({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        codigoBarras: producto.codigoBarras,
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        cantidad: producto.cantidad,
        unidadId: producto.unidad.id.toString() // Convertir a string para el select
      });
    }
  }

  // Preseleccionar la primera unidad en modo crear
  private preseleccionarPrimeraUnidad(): void {
    if (this.unidades && this.unidades.length > 0) {
      const primeraUnidad = this.unidades[0];
      this.productoForm.patchValue({
        unidadId: primeraUnidad.id.toString()
      });
    }
  }

  // Obtener título del modal
  getTitleText(): string {
    switch (this.data.mode) {
      case 'create': return 'Crear Nuevo Producto';
      case 'edit': return 'Editar Producto';
      case 'view': return 'Detalle del Producto';
      default: return 'Producto';
    }
  }

  // Obtener icono del título
  getTitleIcon(): string {
    switch (this.data.mode) {
      case 'create': return 'add_box';
      case 'edit': return 'edit';
      case 'view': return 'visibility';
      default: return 'inventory_2';
    }
  }

  // Cancelar/Cerrar modal
  onCancel(): void {
    this.dialogRef.close();
  }

  // Guardar producto
  onSave(): void {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;
      
      // Crear objeto producto sin ID para crear/editar
      const productoData = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion || '',
        codigoBarras: formValue.codigoBarras,
        precioCompra: Number(formValue.precioCompra),
        precioVenta: Number(formValue.precioVenta),
        cantidad: Number(formValue.cantidad),
        unidadId: Number(formValue.unidadId) // Convertir de string a number
      };

      // Agregar ID si es modo edición
      if (this.isEditMode && this.data.producto) {
        (productoData as any).id = this.data.producto.id;
      }

      // Retornar datos al componente padre
      this.dialogRef.close({
        action: this.isCreateMode ? 'create' : 'edit',
        data: productoData
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.markFormGroupTouched();
    }
  }

  // Marcar todos los campos como touched
  private markFormGroupTouched(): void {
    Object.keys(this.productoForm.controls).forEach(key => {
      const control = this.productoForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos para futuras integraciones con servicios
  private crearProducto(productoData: any): void {
    // TODO: Implementar llamada al servicio para crear producto
    console.log('Crear producto:', productoData);
  }

  private editarProducto(productoData: any): void {
    // TODO: Implementar llamada al servicio para editar producto
    console.log('Editar producto:', productoData);
  }
}
