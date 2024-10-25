import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisAsistenciasPageRoutingModule } from './mis-asistencias-routing.module';

import { MisAsistenciasPage } from './mis-asistencias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisAsistenciasPageRoutingModule
  ],
  declarations: [MisAsistenciasPage]
})
export class MisAsistenciasPageModule {}
