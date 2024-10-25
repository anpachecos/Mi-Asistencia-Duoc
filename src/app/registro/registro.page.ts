import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service'; // Importar el servicio de almacenamiento

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRecuperar: FormGroup;

  constructor(
    public fb: FormBuilder, 
    public alertController: AlertController,
    public navCtrl: NavController,
    private storageService: StorageService // Inyectar el servicio de almacenamiento
  ) { 
    
    // Agrega la validación de coincidencia de contraseñas al FormGroup
    this.formularioRecuperar = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'confirmacionPassword': new FormControl("", Validators.required),
    }, { validator: this.passwordMatchValidator });  // Aquí se agrega el validador personalizado
  }

  ngOnInit() {}

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmacionPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Función para cambiar la contraseña
  async recuperar() {
    const f = this.formularioRecuperar.value;

    // Verifica si el formulario es inválido o si las contraseñas no coinciden
    if (this.formularioRecuperar.invalid) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: 'Por favor, asegúrate de que las contraseñas coincidan y que todos los campos estén completos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    // Obtener la lista de usuarios desde Ionic Storage
    const usuarios = await this.storageService.get('usuarios') || [];

    // Encontrar el usuario en la lista
    const usuario = usuarios.find((u: any) => u.nombre === f.nombre);

    // Verificar si el nombre de usuario existe
    if (usuario) {
      // Actualizar la contraseña del usuario
      usuario.password = f.password;

      // Actualizar la lista de usuarios en Ionic Storage
      await this.storageService.set('usuarios', usuarios);

      const alert = await this.alertController.create({
        header: '¡Contraseña Restablecida!',
        message: 'Tu contraseña ha sido actualizada correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();

      this.navCtrl.navigateRoot('login');
    } else {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message: 'El nombre de usuario no existe.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

}
