import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { AlertService } from '../../services/alert/alert.service';
import { MovimientoService } from '../../services/movimiento/movimiento.service';
import { BalanceDTO } from '../../models/balanceDTO';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  balanceDia!: BalanceDTO;
  balanceSemana!: BalanceDTO;
  balanceMes!: BalanceDTO;
  
  constructor(
    private alertService: AlertService,
    private movimientoService: MovimientoService,
  ){
    
  }

  ngOnInit() {
    forkJoin({
      dia:    this.movimientoService.balanceDia(),
      semana: this.movimientoService.balanceSemana(),
      mes:    this.movimientoService.balanceMes()
    }).subscribe({
      next: ({ dia, semana, mes }) => {
        this.balanceDia     = dia;
        this.balanceSemana = semana;
        this.balanceMes    = mes;
      },
      error: err => {
        this.alertService.show(err.error?.message || 'Error al obtener balances', 'error');
      }
    });
  }

  formatBalance(value?: number): string {
    const valor = value ?? 0;
    const absValue = Math.abs(valor);

    const formato = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return `COP $${valor < 0 ? '-' : ''}${formato.format(absValue)}`;
  }

  formatPorcentaje(value?: number): string {
    const valor = value ?? 0;
    const absValue = Math.abs(valor);

    const formato = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${valor < 0 ? '-' : '+'}${formato.format(absValue)}%`;
  }

  getValueColor(value?: number): string {
    const valor = value ?? 0;
    return valor < 0 ? 'text-red-500' : 'text-blue-gray-900';
  }

  getPorcentajeColor(value?: number): string {
    const valor = value ?? 0;
    return valor < 0 ? 'text-red-500' : 'text-green-500';
  }

}
