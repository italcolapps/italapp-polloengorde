import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformacionProductivaPage } from './informacion-productiva.page';

describe('InformacionProductivaPage', () => {
  let component: InformacionProductivaPage;
  let fixture: ComponentFixture<InformacionProductivaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InformacionProductivaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
