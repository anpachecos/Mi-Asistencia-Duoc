import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Importar el servicio de API

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordIcon: string = 'eye-off';

  formularioRecuperar: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    public navCtrl: NavController,
    private apiService: ApiService // Inyectar el servicio de API
  ) {
    this.formularioRecuperar = this.fb.group(
      {
        nombre: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmacionPassword: new FormControl('', Validators.required),
      },
      { validator: this.passwordMatchValidator } // Agregar validador personalizado
    );
  }

  ngOnInit() {}

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordType =
      this.confirmPasswordType === 'password' ? 'text' : 'password';
    this.confirmPasswordIcon =
      this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmacionPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Función para cambiar la contraseña
  async recuperar() {
    const f = this.formularioRecuperar.value;

    // Verifica si el formulario es inválido
    if (this.formularioRecuperar.invalid) {
      const alert = await this.alertController.create({
        header: '¡Error!',
        message:
          'Por favor, asegúrate de que las contraseñas coincidan y que todos los campos estén completos.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    // Llama a la API para actualizar la contraseña
    this.apiService.updatePassword(f.nombre, f.password).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: '¡Éxito!',
          message: 'Tu contraseña ha sido actualizada correctamente.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        this.navCtrl.navigateRoot('login');
      },
      async (error) => {
        const errorMessage =
          error.error?.error || 'Ocurrió un problema al actualizar la contraseña.';
        const alert = await this.alertController.create({
          header: '¡Error!',
          message: errorMessage,
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    );
  }
}
