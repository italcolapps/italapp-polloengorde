import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepLiquidacionesPage } from './rep-liquidaciones.page';

describe('RepLiquidacionesPage', () => {
  let component: RepLiquidacionesPage;
  let fixture: ComponentFixture<RepLiquidacionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepLiquidacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
