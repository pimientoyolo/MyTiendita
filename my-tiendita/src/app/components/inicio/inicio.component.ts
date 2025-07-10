import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { InicioService } from '../../services/inicio.service';
import { forkJoin } from 'rxjs';
import { VentaDto } from '../../dto/venta.dto';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, AfterViewInit {

  columnas: string[] = ['fecha', 'valor', 'productos', 'acciones'];
  origenDatos: MatTableDataSource<VentaDto> = new MatTableDataSource<VentaDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  balanceDia: any;
  balanceSemana: any;
  balanceMes: any;
  tablaVentas: VentaDto[] = [];

  constructor(
    private inicioService: InicioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.origenDatos.paginator = this.paginator;
    this.origenDatos.sort = this.sort;
  }

  ngOnInit(): void {
    this.fetchBalances();
    this.fetchVentas();
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
      this.cdr.detectChanges();
    });
  }

  fetchVentas() {
    this.inicioService.getVentasInicio().subscribe((data) => {
      this.tablaVentas = data || [];
      this.origenDatos.data = this.tablaVentas;
      this.cdr.detectChanges();
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.origenDatos.filter = valorFiltro.trim().toLowerCase();

    if (this.origenDatos.paginator) {
      this.origenDatos.paginator.firstPage();
    }
  }






}
