import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVentaModalComponent } from './detalle-venta-modal.component';

describe('DetalleVentaModalComponent', () => {
  let component: DetalleVentaModalComponent;
  let fixture: ComponentFixture<DetalleVentaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleVentaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleVentaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
