import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] // corrigido styleUrls no plural
})
export class MenuComponent {

  menu = [
    { descricao: 'Tipos', rota: '/tipos', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3'] },
    { descricao: 'Produtos', rota: '/produtos', niveis: ['NIVEL1', 'NIVEL2'] },
    { descricao: 'Usuários', rota: '/usuarios', niveis: ['NIVEL1'] },
    { descricao: 'Pedidos', rota: '/pedidos', niveis: ['NIVEL2', 'NIVEL3'] },
  ];

  private subscription!: Subscription;
  menuUsuario: { descricao: string, rota: string, niveis: string[] }[] = [];
  nivelUsuario!: string;
  nomeUsuario!: string;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    // Faz a inscrição para atualizar o menu sempre que a rota mudar
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarMenu();
      }
    });

    this.atualizarMenu(); // atualiza ao carregar
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // encerra inscrição
  }

  private atualizarMenu(): void {
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.roles) {
      // Remove "ROLE_" do início do papel do usuário
      this.nivelUsuario = dadosToken.roles.replace(/^ROLE_/, '');
      this.nomeUsuario = dadosToken.sub;
      // Filtra o menu para montar menuUsuario com os itens permitidos
      this.menuUsuario = this.menu.filter(item => item.niveis.includes(this.nivelUsuario));
    } else {
      this.nivelUsuario = '';
      this.nomeUsuario = '';
      this.menuUsuario = [];
    }
  }

  sair(): void {
    this.loginService.limparToken();
    this.atualizarMenu();    
  }
}
