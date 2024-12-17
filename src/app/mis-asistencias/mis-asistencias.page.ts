import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-mis-asistencias',
  templateUrl: './mis-asistencias.page.html',
  styleUrls: ['./mis-asistencias.page.scss'],
})
export class MisAsistenciasPage implements OnInit {
  asistencias: any[] = [];
  filteredAsistencias: any[] = [];
  searchQuery: string = '';

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadAsistencias();
  }

  async loadAsistencias() {
    this.asistencias = await this.storageService.getAsistencias();
    this.filteredAsistencias = [...this.asistencias];
  }

  filterAsistencias() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAsistencias = this.asistencias.filter(asistencia =>
      asistencia.nombre.toLowerCase().includes(query) ||
      asistencia.fecha.toLowerCase().includes(query) ||
      asistencia.sala.toLowerCase().includes(query) ||
      asistencia.seccion.toLowerCase().includes(query)
    );
  }

  async refreshAsistencias() {
    await this.loadAsistencias();
  }
}
