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
    
    // Eliminar el array existente de usuarios
    await this._storage.remove('usuarios');
    
    // Volver a inicializar con los usuarios originales
    const usuariosExistentes = await this._storage.get('usuarios');
    if (!usuariosExistentes) {
      const usuarios = [
        { nombre: 'Antonia', password: '12345', apellido: 'Pacheco', carrera: 'Ingeniería en Informática' },
        { nombre: 'Paolo', password: '881188', apellido: 'Vilches', carrera: 'Administración de Empresas' },
        { nombre: 'Javier', password: '1234', apellido: 'Soto', carrera: 'Agronomía' },
        { nombre: 'Constanza', password: '1234', apellido: 'Pacheco', carrera: 'Enfemería' }
      ];
      await this._storage.set('usuarios', usuarios);
    }
  
    // Imprimir la lista de usuarios actual en la consola
    const usuarios = await this._storage.get('usuarios');
    console.log('Usuarios actuales:', usuarios);
  }
  

  public async getUserByName(nombre: string) {
    await this.init();
    const usuarios = await this._storage?.get('usuarios');
    if (usuarios) {
      const usuarioEncontrado = usuarios.find((usuario: any) => usuario.nombre === nombre);
      if (usuarioEncontrado) {
        return usuarioEncontrado;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } else {  
      throw new Error('No se pudo acceder a la lista de usuarios');
    }
  }

  public async set(key: string, value: any) {
    await this.init(); 
    return this._storage?.set(key, value);
  }

  public async get(key: string) {
    await this.init(); 
    return this._storage?.get(key);
  }

  public async remove(key: string) {
    await this.init(); 
    return this._storage?.remove(key);
  }
}
