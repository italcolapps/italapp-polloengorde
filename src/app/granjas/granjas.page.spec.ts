import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GranjasPage } from './granjas.page';

describe('GranjasPage', () => {
  let component: GranjasPage;
  let fixture: ComponentFixture<GranjasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GranjasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
