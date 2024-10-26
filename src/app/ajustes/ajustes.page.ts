import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';  

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  paletteToggle = false;

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    // Aquí anteriormente tenía el código para cargar el tema guardado en localStorage
    // Pero como hay que manejar persistencia, lo haré con ionicStorage
    const storedThemePreference = await this.storageService.get('darkMode');
    if (storedThemePreference !== null) {
      this.paletteToggle = storedThemePreference;
      this.toggleDarkPalette(this.paletteToggle);
    }
  }

  async toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    await this.storageService.set('darkMode', this.paletteToggle);
    this.toggleDarkPalette(this.paletteToggle);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
