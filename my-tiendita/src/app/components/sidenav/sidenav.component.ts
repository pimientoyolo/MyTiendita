import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  link = {
    isActive : false,
  }

  constructor(
  ) {}

  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit(): void {
  }
}
