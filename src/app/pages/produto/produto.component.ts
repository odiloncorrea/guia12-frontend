import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})

export class ProdutoComponent {
  lista: Produto[] = [];
  mensagemDados = false;

  constructor(private service: ProdutoService, private router: Router) {
  }

  ngOnInit(): void {
    this.carregarLista();
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

  editar(id: number): void {    
    this.router.navigate(['/add-produto', id]);    
  }
}
