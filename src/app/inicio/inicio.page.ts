import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { StorageService } from '../services/storage.service'; // Importa el servicio de almacenamiento

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = ''; // Variable para almacenar el nombre del usuario
  fechaHoy!: string;
  photos: string[] = [];

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private storageService: StorageService // Inyectar el servicio de almacenamiento
  ) {
    this.photos = this.photoService.photos;
  }

  // Método que se ejecuta al cargar la página
  async ngOnInit() {
    // Recuperar el nombre del usuario desde Ionic Storage de forma asíncrona
    this.nombreUsuario = await this.storageService.get('usuarioActivo') || ''; // Si no hay nombre, deja en blanco
    
    // Obtener la fecha actual
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Método para tomar una foto
  async takePhoto(){
    await this.photoService.addNewPhoto();
  }

  // Clases del día de hoy
  clasesHoy = [
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-09-05',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];

  // Método para cerrar sesión
  async cerrarSesion() {
    await this.storageService.remove('ingresado'); // Eliminar el estado de autenticado
    await this.storageService.remove('usuarioActivo'); // Eliminar el nombre del usuario activo
    this.navCtrl.navigateRoot('login'); // Redirigir a la página de login
  }
  

}
