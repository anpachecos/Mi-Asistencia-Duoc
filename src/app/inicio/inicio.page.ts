import { Component, OnInit } from '@angular/core';
import { NavController, AlertController} from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importa el servicio de almacenamiento
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';
import { GoodbyeAnimationComponent } from '../components/goodbye-animation/goodbye-animation.component';
import { ModalController, LoadingController } from '@ionic/angular';



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
    private storageService: StorageService, // Inyectar el servicio de almacenamiento
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Actualizando...',
      spinner: 'circular', 
      duration: 2000 
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Cargando completado');
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
    
    const modal = await this.modalController.create({
      component: GoodbyeAnimationComponent,
      cssClass: 'small-modal'
    });
  
    await modal.present();
  
    // Cierra el modal después de 2 segundos
    setTimeout(() => {
      modal.dismiss();
      // Navega a la página de inicio de sesión o donde desees redirigir
    }, 2000);
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
      header: 'Asistencia Registrada',
      message: `${formattedMessage}Escaneado el: ${dateTime}`,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  
}
