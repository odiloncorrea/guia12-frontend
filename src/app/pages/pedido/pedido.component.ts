import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})

export class PedidoComponent {
  lista: Pedido[] = [];
  mensagemDados = false;

  constructor(private service: PedidoService, private router: Router) {
  }

  ngOnInit(): void {
    this.carregarLista();
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir o registro?')) {
      this.service.excluir(id).subscribe({
        next: () => {
          this.carregarLista();
        },
        error: () => {
          alert('Erro ao excluir o registro. Tente novamente.');
        }
      });
    }
  }

  carregarLista(): void {
    this.mensagemDados = true;
    this.service.listar().subscribe({
      next: (retornoJson) => {
        this.lista = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista.');
      },
      complete: () => {
        this.mensagemDados = false;
      }
    });
  }
}
