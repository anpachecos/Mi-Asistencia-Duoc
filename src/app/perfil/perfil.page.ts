import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  profileImageUrl: string = '';
  nombreUsuario: string = ''; // Variable para almacenar el nombre del usuario

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    this.getRandomPokemonImage();
    await this.cargarNombreUsuario(); // Cargar el nombre del usuario logueado
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

  // Método para cargar el nombre del usuario logueado
  async cargarNombreUsuario() {
    await this.storageService.init(); // Asegura que el storage esté inicializado
    this.nombreUsuario = await this.storageService.get('usuarioActivo') || ''; // Obtener el nombre del usuario
  }
}
