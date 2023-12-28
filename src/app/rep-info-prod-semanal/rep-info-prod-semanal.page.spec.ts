import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepInfoProdSemanalPage } from './rep-info-prod-semanal.page';

describe('RepInfoProdSemanalPage', () => {
  let component: RepInfoProdSemanalPage;
  let fixture: ComponentFixture<RepInfoProdSemanalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RepInfoProdSemanalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
