import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  lista: Usuario[] = [];
  mensagemDados = false;

  constructor(private service: UsuarioService, private router: Router) {
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

  editar(id: number): void {
    this.router.navigate(['/add-usuario', id]);
  }
}
