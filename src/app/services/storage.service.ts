import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    // Crear una lista de usuarios de prueba si no existen
    const usuariosExistentes = await this.get('usuarios');
    if (!usuariosExistentes) {
      const usuarios = [
        { nombre: 'antonia', password: '12345' },
        { nombre: 'luis', password: 'password123' },
        { nombre: 'juan', password: 'abcde' }
      ];

      // Guardar la lista de usuarios en el almacenamiento
      await this.set('usuarios', usuarios);
    }
  }

  // Guardar un valor
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Obtener un valor
  public async get(key: string) {
    return await this._storage?.get(key);
  }

  // Eliminar un valor
  public remove(key: string) {
    this._storage?.remove(key);
  }
}
