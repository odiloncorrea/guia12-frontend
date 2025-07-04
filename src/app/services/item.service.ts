import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
 private apiUrl = `${appSettings.apiBaseUrl}/itens`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(item: Item): Observable<Item> {
    if (item.id) {
      return this.http.put<Item>(`${this.apiUrl}/${item.id}`, item, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Item>(this.apiUrl, item, this.loginService.gerarCabecalhoHTTP());
    }
  }
  
  buscarPorId(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }  
}
