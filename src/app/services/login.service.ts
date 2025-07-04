import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { appSettings } from '../app.config';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${appSettings.apiBaseUrl}/auth`;

  // Subject para emitir evento de login
  private loginSubject = new BehaviorSubject<void>(undefined);
  loginObservable$ = this.loginSubject.asObservable();  

  constructor(private http: HttpClient) { }

  autenticar(login: string, senha: string): Observable<Token> {
    const objetoJS = { login, senha };
    return this.http.post<Token>(this.apiUrl, objetoJS);
  }

  salvarToken(token: string): void {
    localStorage.setItem("Token", token);
  }

  obterToken(): string {
    return localStorage.getItem("Token") || "";
  }

  limparToken(): void {
    localStorage.removeItem("Token");
  }

  extrairDadosToken(): any | null {
    const token = this.obterToken();
    if (!token) return null;
    try {
      const dadosToken = jwtDecode(token);
      return dadosToken;
    } catch (err) {
      return null;
    }
  }

  gerarCabecalhoHTTP() {
    const token = this.obterToken();
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
  } 
  
  //notifica a ocorrência do login
  notificarLogin(): void {
    this.loginSubject.next();
  }  
}



