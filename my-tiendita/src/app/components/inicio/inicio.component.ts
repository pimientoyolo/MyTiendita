import { Component, OnInit } from '@angular/core';
import { InicioService } from '../../services/inicio.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {

  balanceDia: any;
  balanceSemana: any;
  balanceMes: any;

  constructor(
    private inicioService: InicioService
  ) { }

  ngOnInit(): void {
    this.fetchBalances();
  }

  fetchBalances() {
    forkJoin({
      dia: this.inicioService.getBalanceDia(),
      semana: this.inicioService.getBalanceSemana(),
      mes: this.inicioService.getBalanceMes()
    }).subscribe(({ dia, semana, mes }) => {
      this.balanceDia = dia;
      this.balanceSemana = semana;
      this.balanceMes = mes;
    });

  }






}
