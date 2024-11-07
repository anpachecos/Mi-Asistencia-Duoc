import { Component, OnInit } from '@angular/core';
import { NavController, AlertController} from '@ionic/angular';
import { PhotosService } from '../photos.service';
import { StorageService } from '../services/storage.service'; // Importa el servicio de almacenamiento
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombreUsuario: string = ''; // Variable para almacenar el nombre del usuario
  fechaHoy!: string;
  result: string ="";

  constructor(
    public navCtrl: NavController,
    private photoService: PhotosService,
    private storageService: StorageService, // Inyectar el servicio de almacenamiento
    private alertController: AlertController
  ) {
  }

  // Método que se ejecuta al cargar la página
  async ngOnInit() {
    // Asegurar que el almacenamiento esté inicializado y luego recuperar el nombre de usuario
    await this.storageService.init();
    this.nombreUsuario = await this.storageService.get('usuarioActivo') || ''; // Si no hay nombre, deja en blanco
    
    // Obtener la fecha actual
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }



  // Clases de hoy
  clasesHoy = [
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-10-29',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-10-29',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];

  // Método para cerrar sesión
  async cerrarSesion() {
    await this.storageService.remove('ingresado'); // Eliminar el estado de autenticado
    await this.storageService.remove('usuarioActivo'); // Eliminar el nombre del usuario activo
    this.navCtrl.navigateRoot('login'); 
  }

  async scan(): Promise<void> {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL
      });
  
      this.result = result.ScanResult;
      const now = new Date();
      const formattedDateTime = now.toLocaleString();
  
      await this.showAlert(this.result, formattedDateTime);
    } catch (error) {
      console.error('Error al escanear:', error);
    }
  }

  async showAlert(message: string, dateTime: string) {
    let formattedMessage;
  
    try {
      // Intentar formatear como JSON
      const jsonContent = JSON.parse(message);
      formattedMessage = `
        Asignatura: ${jsonContent.asignatura}
        Sección:  ${jsonContent.sección}
        Sala:  ${jsonContent.sala}
      `;
    } catch {
      // Si no es JSON, mostrar como texto normal
      formattedMessage = `Contenido: ${message}`;
    }
  
    const alert = await this.alertController.create({
      header: 'Resultado del QR',
      message: `${formattedMessage}Escaneado el: ${dateTime}`,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  
}
