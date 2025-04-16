import { Component } from '@angular/core';
import { SidebarButtonComponent } from '../sidebar-button/sidebar-button.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    SidebarButtonComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  
}
