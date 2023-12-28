import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalponesPage } from './galpones.page';

describe('GalponesPage', () => {
  let component: GalponesPage;
  let fixture: ComponentFixture<GalponesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GalponesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
