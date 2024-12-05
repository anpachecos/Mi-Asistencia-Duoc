import { Component, OnInit } from '@angular/core';
import { NavController, AlertController} from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importa el servicio de almacenamiento
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';
import { GoodbyeAnimationComponent } from '../components/goodbye-animation/goodbye-animation.component';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Cambiamos al servicio de API




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
    private apiService: ApiService, // Inyectamos ApiService
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
      // Obtener el ID del usuario logueado desde el StorageService
      const idUsuario = await this.storageService.get('idUsuario');
      if (!idUsuario) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }
  
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
      });
  
      const qrData = result.ScanResult; // Texto obtenido del QR
      const [nombre, seccion, sala, fecha] = qrData.split('|'); // Divide los datos
  
      // Construye el objeto de asistencia
      const asistencia = {
        usuario: idUsuario, // Usa el ID del usuario logueado
        nombre,
        seccion,
        sala,
        fecha,
        estado: 'asistió', // Estado predeterminado
      };
  
      // Llama al servicio para registrar la asistencia
      this.apiService.addAsistencia(asistencia).subscribe(
        async (response) => {
          console.log('Asistencia registrada:', response);
  
          // Mostrar pop-up directamente aquí
          const alert = await this.alertController.create({
            header: 'Asistencia Registrada',
            message: `
              Asignatura: ${nombre}<br>
              Sección: ${seccion}<br>
              Sala: ${sala}<br>
              Fecha: ${fecha}
            `,
            buttons: ['OK'],
          });
          await alert.present();
        },
        async (error) => {
          console.error('Error al registrar asistencia:', error);
  
          // Manejar el caso de asistencia duplicada
          let errorMessage = 'No se pudo registrar la asistencia.';
          if (error.status === 400 && error.error?.error?.includes('Ya registraste asistencia')) {
            errorMessage = `Ya registraste asistencia para:<br>
              Asignatura: ${nombre}<br>
              Sección: ${seccion}<br>
              Sala: ${sala}<br>
              Fecha: ${fecha}`;
          }
  
          const alert = await this.alertController.create({
            header: 'Error',
            message: errorMessage,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    } catch (error) {
      console.error('Error al escanear:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo escanear el QR.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }   
  
  
  
}
