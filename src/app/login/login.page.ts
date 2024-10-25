import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importamos nuestro servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  constructor(
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl: NavController,
    private storageService: StorageService // Inyectamos el servicio de almacenamiento
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
    
    const usuarioEncontrado = usuarios.find((usuario: any) => usuario.nombre === f.nombre && usuario.password === f.password);
  
    if (usuarioEncontrado) {
      console.log('Usuario autenticado correctamente');
      await this.storageService.set('ingresado', true); // Marcar como autenticado
      await this.storageService.set('usuarioActivo', usuarioEncontrado.nombre); // Guardar el nombre del usuario activo
      this.navCtrl.navigateRoot('inicio'); // Redirigir a la página de inicio
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
  
}
