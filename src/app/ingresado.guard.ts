import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage.service'; // Importa el servicio de almacenamiento

@Injectable({
  providedIn: 'root'
})
export class IngresadoGuard implements CanActivate {

  constructor(public navCtrl: NavController, private storageService: StorageService) {} // Inyectar el servicio de almacenamiento

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    
    // Usar Ionic Storage para verificar si el usuario está ingresado
    const ingresado = await this.storageService.get('ingresado');
    
    if (ingresado) {
      return true; // Permitir acceso
    } else {
      this.navCtrl.navigateRoot('login'); // Redirigir a la página de login si no está autenticado
      return false;
    }
  }
}
