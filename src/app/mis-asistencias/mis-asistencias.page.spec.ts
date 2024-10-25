import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAsistenciasPage } from './mis-asistencias.page';

describe('MisAsistenciasPage', () => {
  let component: MisAsistenciasPage;
  let fixture: ComponentFixture<MisAsistenciasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAsistenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
