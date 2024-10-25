import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage.service'; // Importa el servicio de almacenamiento

@Injectable({
  providedIn: 'root'
})
export class NoIngresadoGuard implements CanActivate {

  constructor(public navCtrl: NavController, private storageService: StorageService) {} // Inyectar el servicio de almacenamiento

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    
    // Verificar si el usuario está ingresado usando Ionic Storage
    const ingresado = await this.storageService.get('ingresado');
    
    if (ingresado) {
      // Si está ingresado, redirigir a la página de inicio
      this.navCtrl.navigateRoot('inicio');
      return false;
    } else {
      // Si no está ingresado, permitir el acceso a la página
      return true;
    }
  }
}
