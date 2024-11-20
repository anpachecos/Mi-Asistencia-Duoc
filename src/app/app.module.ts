import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage-angular';
import { GoodbyeAnimationComponent } from './components/goodbye-animation/goodbye-animation.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent, GoodbyeAnimationComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule, 
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ],  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
