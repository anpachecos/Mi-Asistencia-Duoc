import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  paletteToggle = false;

  constructor() {}

  ngOnInit() {
    // Leer el estado guardado del modo oscuro desde el localStorage
    const storedThemePreference = localStorage.getItem('darkMode');
    if (storedThemePreference) {
      this.paletteToggle = JSON.parse(storedThemePreference);
      this.toggleDarkPalette(this.paletteToggle);
    }
  }

  // Manejar el cambio desde el botón y guardar el estado en localStorage
  toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    localStorage.setItem('darkMode', JSON.stringify(this.paletteToggle)); // Guardar en localStorage
    this.toggleDarkPalette(this.paletteToggle);
  }

  // Agregar o eliminar la clase "ion-palette-dark" en el elemento html
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
