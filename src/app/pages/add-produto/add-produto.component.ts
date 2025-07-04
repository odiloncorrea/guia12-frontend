import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { TipoService } from '../../services/tipo.service';
import { Tipo } from '../../models/tipo';
import { NgxMaskDirective } from 'ngx-mask';
import { Router, ActivatedRoute,  RouterModule} from '@angular/router';

@Component({
  selector: 'app-add-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './add-produto.component.html',
  styleUrl: './add-produto.component.css'
})
export class AddProdutoComponent {

  formGroup: FormGroup;
  listaTipos: Tipo[] = [];
  produto!: Produto;

  constructor(private formBuilder: FormBuilder, private produtoService: ProdutoService, private route: ActivatedRoute, private router: Router, private tipoService: TipoService) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: [null, Validators.required],
      estoque: [null, Validators.required],
      tipo: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarListaTipo();

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.produto = new Produto();
    if (id) {     
      this.produtoService.buscarPorId(id).subscribe(retorno => {     
        this.produto = retorno;   
        let tipoSelecionado = this.listaTipos.find(temp => temp.id === retorno.tipo!.id);
        this.formGroup.patchValue({
          descricao: this.produto.descricao,
          valor: this.produto.valor,
          estoque: this.produto.estoque,
          tipo: tipoSelecionado
        });
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.produto.descricao = this.formGroup.value.descricao;
      this.produto.valor = this.formGroup.value.valor;
      this.produto.estoque = this.formGroup.value.estoque;
      this.produto.tipo = this.formGroup.value.tipo;
      this.produtoService.salvar(this.produto).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/produtos']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

  carregarListaTipo(): void {
    this.tipoService.listar().subscribe({
      next: (retornoJson) => {
        this.listaTipos = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista.');
      }
    });
  }

}
