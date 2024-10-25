import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
  paletteToggle = false;
  profileImageUrl: string = '';

  constructor() {}

  ngOnInit() {
    this.getRandomPokemonImage();
    
    // Leer el estado guardado del modo oscuro desde el localStorage
    const storedThemePreference = localStorage.getItem('darkMode');
    if (storedThemePreference) {
      this.paletteToggle = JSON.parse(storedThemePreference);
      this.toggleDarkPalette(this.paletteToggle);
    }
  }

  // Método para obtener una imagen de Pokémon aleatoria
  async getRandomPokemonImage() {
    const randomId = Math.floor(Math.random() * 898) + 1; 
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`); //con fetch hacemos la solicitud get jiji
      const data = await response.json();
      this.profileImageUrl = data.sprites.front_default; 
    } catch (error) {
      console.error("Error al obtener la imagen de Pokémon:", error);
    }
  }
  

  toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    localStorage.setItem('darkMode', JSON.stringify(this.paletteToggle));
    this.toggleDarkPalette(this.paletteToggle);
  }

  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
