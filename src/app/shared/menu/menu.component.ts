import { Component, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // para gerenciar a inscrição
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'] // corrigido styleUrls no plural
})
export class MenuComponent implements OnDestroy {

  nivel = 'NIVEL0';

  menu = [
    { descricao: 'Tipos', rota: '/tipos', niveis: ['NIVEL1', 'NIVEL2', 'NIVEL3'] },
    { descricao: 'Produtos', rota: '/produtos', niveis: ['NIVEL1', 'NIVEL2'] },
    { descricao: 'Usuários', rota: '/usuarios', niveis: ['NIVEL1'] },
    { descricao: 'Pedidos', rota: '/pedidos', niveis: ['NIVEL2', 'NIVEL3'] },
  ];

  menuUsuario: { descricao: string, rota: string, niveis: string[] }[] = [];
  nomeUsuario!: string;

  private loginSubscription?: Subscription;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    // Inicializa o menu na primeira vez
    this.atualizarMenu();

    // Se inscreve para atualizar o menu quando login ocorrer
    this.loginSubscription = this.loginService.loginObservable$.subscribe(() => {
      this.atualizarMenu();
    });

    this.nomeUsuario = "Odilon";
  }

  ngOnDestroy(): void {
    // Cancela a inscrição para evitar vazamentos de memória
    this.loginSubscription?.unsubscribe();
  }

  private atualizarMenu(): void {
    const dadosToken = this.loginService.extrairDadosToken();

    if (dadosToken && dadosToken.roles) {
      // Remove "ROLE_" do início do papel do usuário
      this.nivel = dadosToken.roles.replace(/^ROLE_/, '');
    } else {
      console.warn('Não foi possível determinar o nível do usuário a partir do token.');
      this.nivel = 'NIVEL0'; // força menu vazio em caso de erro
    }

    // Filtra o menu para montar menuUsuario com os itens permitidos
    this.menuUsuario = this.menu.filter(item => item.niveis.includes(this.nivel));

  }

  sair(event: Event): void {
    event.preventDefault(); // evita que o link faça o reload da página

    this.menuUsuario = [];

    this.loginService.limparToken();

    this.router.navigate(['/']);
  }
}
