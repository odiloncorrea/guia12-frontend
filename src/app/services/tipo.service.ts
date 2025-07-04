import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipo } from '../models/tipo';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TipoService {  
  
  private apiUrl = `${appSettings.apiBaseUrl}/tipos`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(tipo: Tipo): Observable<Tipo> {
    if (tipo.id) {
      return this.http.put<Tipo>(`${this.apiUrl}/${tipo.id}`, tipo, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Tipo>(this.apiUrl, tipo, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Tipo> {
    return this.http.get<Tipo>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }
}
