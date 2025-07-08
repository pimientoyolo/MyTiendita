import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit(): void {
  }

  enrutar(ruta: string){
    this.router.navigate([ruta]);
  }
}
