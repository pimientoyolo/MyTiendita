import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentaService } from '../../services/venta/venta.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

export interface MovimientoModalData {
  mode: 'create';
}

@Component({
  selector: 'app-movimiento-modal',
  standalone: false,
  templateUrl: './movimiento-modal.component.html',
  styleUrl: './movimiento-modal.component.scss'
})
export class MovimientoModalComponent implements OnInit {

  movimientoForm!: FormGroup;
  loading = false;

  // Tipos de movimiento disponibles (solo Entrada y Salida)
  tiposMovimiento = [
    { id: 3, nombre: 'Salida', descripcion: 'Salida de dinero' },
    { id: 4, nombre: 'Entrada', descripcion: 'Entrada de dinero' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<MovimientoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MovimientoModalData
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Preseleccionar el primer tipo de movimiento
    if (this.tiposMovimiento.length > 0) {
      this.movimientoForm.patchValue({
        tipoMovimientoId: this.tiposMovimiento[0].id
      });
    }
  }

  // Inicializar formulario
  private initForm(): void {
    this.movimientoForm = this.fb.group({
      monto: ['', [Validators.required, this.createMontoValidator()]],
      tipoMovimientoId: ['', [Validators.required]]
    });

    // Configurar formateo automático del monto
    this.setupMontoFormatting();
  }

  // Crear validador de monto con acceso a métodos de la clase
  private createMontoValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }

      // Usar parseMonto para obtener el valor numérico
      const value = this.parseMonto(control.value.toString());
      
      if (isNaN(value) || value <= 0) {
        return { invalidMonto: true };
      }

      if (value > 999999999) {
        return { maxMonto: true };
      }

      return null;
    };
  }

  // Configurar formateo automático del monto
  private setupMontoFormatting(): void {
    const montoControl = this.movimientoForm.get('monto');
    
    if (montoControl) {
      montoControl.valueChanges.subscribe(value => {
        if (value && value !== '') {
          const formatted = this.formatMonto(value);
          if (formatted !== value) {
            montoControl.setValue(formatted, { emitEvent: false });
          }
        }
      });
    }
  }

  // Formatear monto con separadores de miles sin decimales
  private formatMonto(value: any): string {
    if (!value || value === '') return '';
    
    // Remover todos los caracteres que no sean números
    const numericValue = value.toString().replace(/[^\d]/g, '');
    
    if (!numericValue || numericValue === '0') return '';
    
    // Convertir a número y formatear con separadores de miles
    const number = parseInt(numericValue, 10);
    return number.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // Convertir monto formateado a número
  private parseMonto(formattedMonto: string): number {
    if (!formattedMonto || formattedMonto === '') return 0;
    const numericValue = formattedMonto.replace(/[^\d]/g, '');
    return parseInt(numericValue, 10) || 0;
  }

  // Obtener texto del título
  getTitleText(): string {
    return 'Nuevo Movimiento';
  }

  // Obtener icono del título
  getTitleIcon(): string {
    return 'add_circle';
  }

  // Obtener descripción del tipo seleccionado
  getTipoDescripcion(): string {
    const tipoId = this.movimientoForm.get('tipoMovimientoId')?.value;
    const tipo = this.tiposMovimiento.find(t => t.id === tipoId);
    return tipo ? tipo.descripcion : '';
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return this.movimientoForm.valid && !this.loading;
  }

  // Guardar movimiento
  onGuardar(): void {
    if (!this.isFormValid()) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.movimientoForm.value;
    const monto = this.parseMonto(formValue.monto);
    const tipoMovimientoId = formValue.tipoMovimientoId;

    this.ventaService.crearMovimiento(monto, tipoMovimientoId).subscribe({
      next: () => {
        this.loading = false;
        this.snackbarService.exito('Movimiento creado exitosamente');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error al crear movimiento:', error);
        this.snackbarService.error('Error al crear el movimiento');
      }
    });
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(): void {
    Object.keys(this.movimientoForm.controls).forEach(key => {
      const control = this.movimientoForm.get(key);
      control?.markAsTouched();
    });
  }

  // Cancelar y cerrar modal
  onCancelar(): void {
    this.dialogRef.close(false);
  }

  // Obtener mensaje de error para el monto
  getMontoErrorMessage(): string {
    const montoControl = this.movimientoForm.get('monto');
    
    if (montoControl?.hasError('required')) {
      return 'El monto es obligatorio';
    }
    
    if (montoControl?.hasError('invalidMonto')) {
      return 'El monto debe ser mayor a 0';
    }
    
    if (montoControl?.hasError('maxMonto')) {
      return 'El monto no puede exceder $999,999,999';
    }
    
    return '';
  }
}
