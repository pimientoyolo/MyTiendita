import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { Unidad } from '../../models/unidad';
import { TipoMovimientoService } from '../../services/tipo-movimiento/tipo-movimiento.service';
import { MovimientoService } from '../../services/movimiento/movimiento.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { TipoMovimiento } from '../../models/tipo-movimiento';

@Component({
  selector: 'app-movimientos-dinero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './movimientos-dinero.component.html',
  styleUrl: './movimientos-dinero.component.css'
})
export class MovimientosDineroComponent implements OnInit{

  form!: FormGroup;

  tiposMovimientos: TipoMovimiento[] = [];

  constructor(
    private fb: FormBuilder,
    private tipoMovimientoService: TipoMovimientoService,
    private alertService: AlertService,
    private movimientoService: MovimientoService
  ){

  }

  ngOnInit(): void {

    this.form = this.fb.group({
      monto: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\,\d{1,2})?$/)
        ]
      ],
      tipoMovimientoId: [null, Validators.required]
    });

    // Cargar tipos de movimientos
    this.tipoMovimientoService.getSalidaEntrada().subscribe({
      next: (data) => {
        this.tiposMovimientos = data;
      },
      error: () => {
        this.alertService.show('Ocurrió un error al cargar los tipos de movimientos', 'error');
      }
    });
    
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const cantidad = this.form.value.monto;
    const tipoId   = this.form.value.tipoMovimientoId;

    if ( cantidad <= 0 ) {
      this.alertService.show('El monto debe ser mayor a 0', 'error');
      return;
    }

    this.movimientoService.createMovimiento(cantidad, tipoId).subscribe({
      next: () => {
        this.alertService.show('Movimiento creado exitosamente', 'success');
        this.form.reset();
      },
      error: (error) => {
        this.alertService.show(error.error.message, 'error');
      }
    });
    
  }

  onCancel() {
    this.form.reset();
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

}
