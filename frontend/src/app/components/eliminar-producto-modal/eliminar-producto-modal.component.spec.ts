import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarProductoModalComponent } from './eliminar-producto-modal.component';

describe('EliminarProductoModalComponent', () => {
  let component: EliminarProductoModalComponent;
  let fixture: ComponentFixture<EliminarProductoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EliminarProductoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarProductoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
