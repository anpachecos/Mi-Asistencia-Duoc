import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guardar un valor
  public async set(key: string, value: any) {
    await this.init();
    return this._storage?.set(key, value);
  }

  // Obtener un valor
  public async get(key: string) {
    await this.init();
    return this._storage?.get(key);
  }

  // Eliminar un valor
  public async remove(key: string) {
    await this.init();
    return this._storage?.remove(key);
  }

  // Limpiar el almacenamiento (si es necesario)
  public async clear() {
    await this.init();
    return this._storage?.clear();
  }
}
