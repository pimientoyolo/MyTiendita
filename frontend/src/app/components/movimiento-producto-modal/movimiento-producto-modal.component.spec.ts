import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoProductoModalComponent } from './movimiento-producto-modal.component';

describe('MovimientoProductoModalComponent', () => {
  let component: MovimientoProductoModalComponent;
  let fixture: ComponentFixture<MovimientoProductoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientoProductoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
