import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-mis-asistencias',
  templateUrl: './mis-asistencias.page.html',
  styleUrls: ['./mis-asistencias.page.scss'],
})
export class MisAsistenciasPage implements OnInit {
  asistencias: any[] = []; // Asistencias obtenidas desde la API
  filteredAsistencias: any[] = []; // Asistencias filtradas
  searchQuery: string = ''; // Término de búsqueda

  constructor(private apiService: ApiService, private storageService: StorageService) {}

  async ngOnInit() {
    // Obtener el ID del usuario desde StorageService
    const usuarioId = await this.storageService.get('idUsuario');
    if (usuarioId) {
      this.loadAsistencias(usuarioId);
    } else {
      console.error('No se pudo obtener el ID del usuario. Asegúrate de estar logueado.');
    }
  }

  loadAsistencias(usuarioId: number) {
    this.apiService.getAsistencias(usuarioId).subscribe(
      (data) => {
        this.asistencias = data; // Guardar asistencias
        this.filteredAsistencias = [...this.asistencias]; // Inicializar filtrado
      },
      (error) => {
        console.error('Error al cargar asistencias:', error);
      }
    );
  }

  filterAsistencias() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAsistencias = this.asistencias.filter((asistencia) => 
      asistencia.titulo.toLowerCase().includes(query) ||
      asistencia.fecha.toLowerCase().includes(query) ||
      asistencia.ubicacion.toLowerCase().includes(query) ||
      asistencia.descripcion.toLowerCase().includes(query)
    );
  }
}
