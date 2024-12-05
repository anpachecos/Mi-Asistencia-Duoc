import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Cambiamos al servicio de API
import { LoadingController } from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importamos nuestro servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  formularioLogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private apiService: ApiService, // Inyectamos ApiService
    private loadingCtrl: LoadingController,
    private storageService: StorageService // Inyectamos el servicio para los guards
  ) {
    this.formularioLogin = this.fb.group({
      nombre: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordType =
      this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon =
      this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  async ingresar() {
    const f = this.formularioLogin.value;
  
    // Validar credenciales predeterminadas (admin/admin) primero
    if (f.nombre === 'admin' && f.password === 'admin') {
      console.log('Autenticado como usuario predeterminado (admin)');
  
      // Guardar los datos necesarios en StorageService
      await this.storageService.set('ingresado', true); // Marcar como autenticado
      await this.storageService.set('usuarioActivo', 'admin'); // Guardar el nombre del usuario predeterminado
      await this.storageService.set('idUsuario', '0'); // Guardar un ID ficticio para el usuario admin
  
      this.navCtrl.navigateRoot('inicio'); // Navegar al inicio
      return; // Termina aquí si las credenciales son admin/admin
    }
  
    // Mostrar un loading mientras se verifica con la API
    const loading = await this.loadingCtrl.create({
      message: 'Ingresando...',
      spinner: 'circular',
    });
    await loading.present();
  
    // Llamar a la API para obtener usuarios por nombre
    this.apiService.getUserByName(f.nombre).subscribe(
      async (usuarios) => {
        await loading.dismiss();
  
        // Filtrar el usuario correcto en la lista retornada
        const usuarioEncontrado = usuarios.find(
          (usuario: any) =>
            usuario.nombre === f.nombre && usuario.contrasena === f.password
        );
  
        if (usuarioEncontrado) {
          console.log('Usuario autenticado correctamente');
  
          // Guardar los datos necesarios en StorageService
          await this.storageService.set('ingresado', true); // Marcar como autenticado
          await this.storageService.set('usuarioActivo', usuarioEncontrado.nombre); // Guardar el nombre del usuario activo
          await this.storageService.set('idUsuario', usuarioEncontrado.id); // Guardar el ID del usuario
  
          this.navCtrl.navigateRoot('inicio'); // Navegar al inicio
        } else {
          this.mostrarAlerta('Error', 'Usuario o contraseña incorrectos.');
        }
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error en el login:', error);
        this.mostrarAlerta(
          'Error',
          'Ocurrió un problema al verificar tus credenciales.'
        );
      }
    );
  }
  


  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }
}
