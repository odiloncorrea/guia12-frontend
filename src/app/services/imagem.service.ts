import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imagem } from '../models/imagem';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ImagemService {

  private apiUrl = `${appSettings.apiBaseUrl}/imagens/upload`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  upload(file: File): Observable<Imagem> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Imagem>(this.apiUrl, formData, this.loginService.gerarCabecalhoHTTP());
  }

}
