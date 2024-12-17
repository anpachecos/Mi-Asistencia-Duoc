import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController, LoadingController } from '@ionic/angular'; // Importamos LoadingController
import { StorageService } from '../services/storage.service'; // Importamos nuestro servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  formularioLogin: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private storageService: StorageService, // Inyectamos el servicio de almacenamiento
    private loadingController: LoadingController // Inyectamos el LoadingController
  ) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }

  ngOnInit() {}

  async ingresar() {
    const f = this.formularioLogin.value;
    const usuarios = await this.storageService.get('usuarios');

    const usuarioEncontrado = usuarios.find(
      (usuario: any) => usuario.nombre === f.nombre && usuario.password === f.password
    );

    if (usuarioEncontrado) {
      console.log('Usuario autenticado correctamente');

      // Mostrar el loading durante 2 segundos
      const loading = await this.loadingController.create({
        message: 'Ingresando...',
        spinner: 'crescent',
        duration: 2000, // Duración de 2 segundos
      });
      await loading.present();

      // Esperar que el loading termine
      await loading.onDidDismiss();

      // Marcar como autenticado y redirigir
      await this.storageService.set('ingresado', true);
      await this.storageService.set('usuarioActivo', usuarioEncontrado.nombre);
      this.navCtrl.navigateRoot('inicio');
    } else {
      // Mostrar alerta de error si las credenciales no son correctas
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
