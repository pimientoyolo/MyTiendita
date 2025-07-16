import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoModalComponent } from './movimiento-modal.component';

describe('MovimientoModalComponent', () => {
  let component: MovimientoModalComponent;
  let fixture: ComponentFixture<MovimientoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
