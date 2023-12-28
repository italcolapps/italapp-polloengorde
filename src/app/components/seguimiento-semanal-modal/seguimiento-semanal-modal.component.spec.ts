import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeguimientoSemanalModalComponent } from './seguimiento-semanal-modal.component';

describe('SeguimientoSemanalModalComponent', () => {
  let component: SeguimientoSemanalModalComponent;
  let fixture: ComponentFixture<SeguimientoSemanalModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoSemanalModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeguimientoSemanalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
