import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {

  private apiUrl = `${appSettings.apiBaseUrl}/pedidos`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(pedido: Pedido): Observable<Pedido> {
    if (pedido.id) {
      return this.http.put<Pedido>(`${this.apiUrl}/${pedido.id}`, pedido, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Pedido>(this.apiUrl, pedido, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }  

  listarItens(idPedido: number): Observable<Item[]> {
    const url = `${this.apiUrl}/${idPedido}/itens`;
    return this.http.get<Item[]>(url, this.loginService.gerarCabecalhoHTTP());
  }  

}