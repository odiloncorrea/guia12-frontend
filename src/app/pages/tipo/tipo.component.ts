import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoService } from '../../services/tipo.service';
import { Tipo } from '../../models/tipo';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo.component.html',
  styleUrl: './tipo.component.css'
})
export class TipoComponent {
  lista: Tipo[] = [];
  objeto!: Tipo;
  modalAberto = false;
  formGroup: FormGroup;
  mensagemDados = false;

  constructor(private service: TipoService, private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required]
    });
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
    this.service.buscarPorId(id).subscribe({
      next: (retorno) => {
        this.objeto = retorno;
        this.formGroup.patchValue(this.objeto);
        this.abrirModal();
      },
      error: () => {
        alert('Erro ao buscar os dados do registro. Tente novamente.');
      }
    });
  }

  cadastrar() {
    this.objeto = new Tipo();
    this.abrirModal();
    this.formGroup.reset();
  }

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;

      this.objeto.id = formValue.id;
      this.objeto.descricao = formValue.descricao;

      this.service.salvar(this.objeto).subscribe({
        next: () => {
          this.formGroup.reset();
          this.carregarLista();
          this.fecharModal();
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });

    }
  }
}
