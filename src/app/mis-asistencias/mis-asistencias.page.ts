import { Component } from '@angular/core';

@Component({
  selector: 'app-mis-asistencias',
  templateUrl: './mis-asistencias.page.html',
  styleUrls: ['./mis-asistencias.page.scss'],
})
export class MisAsistenciasPage {

  // Array con asistencias
  asistencias = [
    {
      titulo: 'ÉTICA PARA EL TRABAJO',
      fecha: '2024-09-03',
      ubicacion: 'SALA SJ-706',
      descripcion: 'Sección EAY4470'
    },
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-09-07',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-09-09',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];

  searchQuery: string = ''; // Término de búsqueda
  filteredAsistencias = [...this.asistencias]; // Array para las asistencias filtradas

  constructor() { }

  filterAsistencias() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAsistencias = this.asistencias.filter(asistencia => 
      asistencia.titulo.toLowerCase().includes(query) ||
      asistencia.fecha.toLowerCase().includes(query) ||
      asistencia.ubicacion.toLowerCase().includes(query) ||
      asistencia.descripcion.toLowerCase().includes(query)
    );
  }
}
