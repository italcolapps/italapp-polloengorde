import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidacionesPage } from './liquidaciones.page';

describe('LiquidacionesPage', () => {
  let component: LiquidacionesPage;
  let fixture: ComponentFixture<LiquidacionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LiquidacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
