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

    // Sobrescribe o crea la lista de usuarios en cada inicio
    const usuarios = [
      { nombre: 'Antonia', password: '12345' },
      { nombre: 'Pedro', password: '881188' },
      { nombre: 'Juan', password: 'abcde' }
    ];

    // Guardar la lista de usuarios en el almacenamiento
    await this.storage.set('usuarios', usuarios);
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
