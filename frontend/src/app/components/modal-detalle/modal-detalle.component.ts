import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-detalle',
  imports: [],
  templateUrl: './modal-detalle.component.html',
  styleUrl: './modal-detalle.component.css'
})
export class ModalDetalleComponent {
  detallesVenta: any[] = [];
  paginaModal = 1;
  itemsPorPaginaModal = 5;

  get totalPaginasModal(): number {
    return Math.ceil(this.detallesVenta.length / this.itemsPorPaginaModal);
  }

  get productosModalPaginados() {
    const inicio = (this.paginaModal - 1) * this.itemsPorPaginaModal;
    return this.detallesVenta.slice(inicio, inicio + this.itemsPorPaginaModal);
  }

}
