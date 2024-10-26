import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  // Inicializa el almacenamiento
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    // Sobrescribe o crea la lista de usuarios en cada inicio
    const usuarios = [
      { nombre: 'Antonia', password: '12345' },
      { nombre: 'Pedro', password: '881188' },
      { nombre: 'Juan', password: 'abcde' },
      { nombre: 'Javier', password: '1234' },
      { nombre: 'Constanza', password: '1234' }
    ];

    // Guardar la lista de usuarios en el almacenamiento
    await this._storage.set('usuarios', usuarios);
  }

  // Guardar un valor
  public async set(key: string, value: any) {
    await this.init(); // Aseguramos que Storage esté listo
    return this._storage?.set(key, value);
  }

  // Obtener un valor
  public async get(key: string) {
    await this.init(); // Aseguramos que Storage esté listo
    return this._storage?.get(key);
  }

  // Eliminar un valor
  public async remove(key: string) {
    await this.init(); // Aseguramos que Storage esté listo
    return this._storage?.remove(key);
  }
}
