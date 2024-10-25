import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoIngresadoGuard } from './no-ingresado.guard';
import { IngresadoGuard } from './ingresado.guard';

const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'mis-asistencias',
    loadChildren: () => import('./mis-asistencias/mis-asistencias.module').then( m => m.MisAsistenciasPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./ajustes/ajustes.module').then( m => m.AjustesPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

  //aquiiiii 404
  // Si hago más cosas, osea rutas, tienen que ir en orden porque va validando de arriba hacia abajo
  //Recordar que está bugeado el color, si tu pones modo oscuro te va atirar a la 404 en blanco. 
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
