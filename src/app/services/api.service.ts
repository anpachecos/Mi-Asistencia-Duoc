import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}usuarios/`);
  }

  // Obtener un usuario por nombre
  getUserByName(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}usuarios/?search=${nombre}`);
  }

  // Crear un usuario
  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/`, usuario);
  }

  // Eliminar un usuario por ID
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}usuarios/${id}/`);
  }
}
