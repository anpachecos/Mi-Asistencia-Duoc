import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  profileImageUrl: string = '';

  constructor() {}

  ngOnInit() {
    this.getRandomPokemonImage();
  }

  // Método para obtener una imagen de Pokémon aleatoria
  async getRandomPokemonImage() {
    const randomId = Math.floor(Math.random() * 898) + 1; 
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      this.profileImageUrl = data.sprites.front_default; 
    } catch (error) {
      console.error("Error al obtener la imagen de Pokémon:", error);
    }
  }
}
