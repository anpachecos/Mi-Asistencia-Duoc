import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisAsistenciasPage } from './mis-asistencias.page';

const routes: Routes = [
  {
    path: '',
    component: MisAsistenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisAsistenciasPageRoutingModule {}
