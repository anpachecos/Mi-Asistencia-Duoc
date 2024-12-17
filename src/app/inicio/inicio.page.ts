import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import {
  BarcodeScanner,
  BarcodeFormat,
  ScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { GoodbyeAnimationComponent } from '../components/goodbye-animation/goodbye-animation.component';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  public codigos: any[] = [];
  public escaneando: boolean = false;
  private procesando: boolean = false;

  nombreUsuario: string = '';
  fechaHoy!: string;
  result: string = '';

  constructor(
    public navCtrl: NavController,
    private storageService: StorageService,
    private alertController: AlertController,
    private apiService: ApiService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.storageService.init();
    this.nombreUsuario = (await this.storageService.get('usuarioActivo')) || '';

    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Actualizando...',
      spinner: 'circular',
      duration: 2000,
    });
    await loading.present();
    await loading.onDidDismiss();
    console.log('Cargando completado');
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cierre de Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            // Elimina datos de sesión y redirige a la página de login
            await this.storageService.remove('ingresado');
            await this.storageService.remove('usuarioActivo');
            this.navCtrl.navigateRoot('login');
  
            // Muestra animación de despedida
            const modal = await this.modalController.create({
              component: GoodbyeAnimationComponent,
              cssClass: 'small-modal',
            });
  
            await modal.present();
  
            setTimeout(() => {
              modal.dismiss();
            }, 2000);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  async scan() {
    try {
      this.escaneando = true;
      const options: ScanOptions = {
        formats: [BarcodeFormat.QrCode],
      };
  
      const result = await BarcodeScanner.scan(options);
  
      if (result?.barcodes?.length > 0) {
        // Obtener el contenido del QR
        const contenido = result.barcodes[0].displayValue || '';
  
        // Dividir el contenido del QR en partes
        const partes = contenido.split('|');
        if (partes.length === 4) {
          const [asignatura, seccion, sala, fecha] = partes;
  
          // Verificar si ya existe en asistencias
          const asistencias = await this.storageService.getAsistencias();
          const asistenciaExistente = asistencias.find(
            (a: any) => a.contenidoQR === contenido
          );
  
          if (asistenciaExistente) {
            // Mostrar alerta de duplicado
            await this.showAlert('QR duplicado', 'Este código ya fue escaneado.');
            return;
          }
  
          // Crear un objeto de asistencia basado en los datos del QR
          const asistencia = {
            nombre: asignatura, // Asignatura del QR
            fecha: `${fecha.slice(6, 8)}/${fecha.slice(4, 6)}/${fecha.slice(0, 4)}`, // Fecha formateada
            seccion, // Sección del QR
            sala, // Sala del QR
            contenidoQR: contenido, // Todo el contenido original del QR
          };
  
          // Guardar la asistencia en el almacenamiento
          await this.storageService.addAsistencia(asistencia);
  
          // Mostrar una alerta con los datos registrados
          await this.showAlert(
            'Asistencia registrada',
            `Asignatura: ${asignatura}\nSección: ${seccion}\nSala: ${sala}\nFecha: ${asistencia.fecha}`
          );
        } else {
          await this.showAlert('Error', 'El formato del código QR es inválido.');
        }
      } else {
        await this.showAlert('Escaneo cancelado', 'No se detectó ningún código QR.');
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      await this.showAlert('Error', 'Hubo un problema al escanear el código QR.');
    } finally {
      this.escaneando = false;
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  clasesHoy = [
    {
      titulo: 'PROGRAMACIÓN DE APLICACIONES MÓVILES',
      fecha: '2024-12-05',
      ubicacion: 'SALA SJ-L7',
      descripcion: 'Sección PGY4121'
    },
    {
      titulo: 'ESTADÍSTICA DESCRIPTIVA',
      fecha: '2024-12-05',
      ubicacion: 'SALA SJ-L4',
      descripcion: 'Sección MAT4140'
    }
  ];
}
