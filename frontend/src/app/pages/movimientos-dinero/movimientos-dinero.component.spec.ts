import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosDineroComponent } from './movimientos-dinero.component';

describe('MovimientosDineroComponent', () => {
  let component: MovimientosDineroComponent;
  let fixture: ComponentFixture<MovimientosDineroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosDineroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosDineroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
