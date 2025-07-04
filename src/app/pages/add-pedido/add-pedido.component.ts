import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { NgxMaskDirective } from 'ngx-mask';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  templateUrl: './add-pedido.component.html',
  styleUrl: './add-pedido.component.css'
})
export class AddPedidoComponent {

  formGroupPedido: FormGroup;
  formGroupItem: FormGroup;
  produtos: Produto[] = [];
  itens: Item[] = [];
  itensRemovidos: Item[] = [];
  usuarios: Usuario[] = [];
  pedido: Pedido;


  constructor(private formBuilder: FormBuilder, private produtoService: ProdutoService, private route: ActivatedRoute, private router: Router, private pedidoService: PedidoService, private usuarioService: UsuarioService, private itemService: ItemService) {

    this.pedido = new Pedido();

    this.formGroupItem = this.formBuilder.group({
      id: [null],
      produto: [null, Validators.required],
      valor: [null, Validators.required],
      quantidade: [null, Validators.required]
    });

    this.formGroupPedido = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, Validators.required],
      usuario: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarUsuarios();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.pedidoService.buscarPorId(id).subscribe({
        next: (pedido) => {
          this.pedido = pedido;
          let usuarioSelecionado = this.usuarios.find(temp => temp.id === pedido.usuario!.id);
          this.formGroupPedido.patchValue({
            id: pedido.id,
            data: pedido.data,
            valor: pedido.valor,
            usuario: usuarioSelecionado
          });

          this.pedidoService.listarItens(id).subscribe({
            next: (itens) => {
              this.itens = itens;
              this.atualizarValorTotal();
            }
          });

        },
        error: () => {
          alert('Erro ao carregar o pedido.');
        }
      });
    }
    this.formGroupItem.get('produto')?.valueChanges.subscribe((produtoSelecionado: Produto | null) => {
      if (produtoSelecionado) {
        this.formGroupItem.patchValue({
          valor: produtoSelecionado.valor
        });
      } else {
        this.formGroupItem.patchValue({
          valor: null
        });
      }
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: () => {
        alert('Erro ao carregar a lista de usuários.');
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: () => {
        alert('Erro ao carregar a lista de produtos.');
      }
    });
  }

  adicionarItem(): void {
    const itemFormValue = this.formGroupItem.value;
    const produtoSelecionado = itemFormValue.produto;

    const itemExistente = this.itens.find(item => item.produto?.id === produtoSelecionado.id);

    if (itemExistente) {
      itemExistente.quantidade += itemFormValue.quantidade;
    } else {
      const novoItem: Item = {
        id: 0,
        produto: produtoSelecionado,
        valor: itemFormValue.valor,
        quantidade: itemFormValue.quantidade,
        idPedido: this.pedido.id
      };
      this.itens.push(novoItem);
    }

    this.atualizarValorTotal();
    this.formGroupItem.reset();
  }

  excluirItem(produtoId: any): void {
    const itemRemovido = this.itens.find(item => item.produto?.id === produtoId);
    if (itemRemovido && itemRemovido.id && itemRemovido.id !== 0) {
      this.itensRemovidos.push(itemRemovido);
    }
    this.itens = this.itens.filter(item => item.produto?.id !== produtoId);
    this.atualizarValorTotal();
  }

  atualizarValorTotal(): void {
    const valorTotal = this.itens.reduce((soma, item) => {
      const valorItem = Number(item.valor) || 0;
      const quantidade = Number(item.quantidade) || 0;
      return soma + (valorItem * quantidade);
    }, 0);

    this.formGroupPedido.patchValue({
      valor: valorTotal
    });
  }

  salvarPedido(): void {
    if (this.formGroupPedido.valid) {
      this.pedidoService.salvar(this.formGroupPedido.value).subscribe({
        next: (pedidoSalvo) => {
          this.itens.forEach(item => item.idPedido = pedidoSalvo.id);

          const salvarItens$ = this.itens.map(item =>
            this.itemService.salvar(item)
          );

          const excluirItens$ = this.itensRemovidos.map(item =>
            this.itemService.excluir(item.id!)  
          );

          //O forkJoin recebe um array de Observables, executa todas as requisições em paralelo e aguarda até que todas sejam concluídas.
          forkJoin([...salvarItens$, ...excluirItens$]).subscribe({
            next: () => {
              alert('Registro salvo com sucesso!');
              this.formGroupPedido.reset();
              this.itens = [];
              this.itensRemovidos = [];
              this.router.navigate(['/pedidos']);
            },
            error: () => {
              alert('Erro ao salvar os itens ou excluir os removidos.');
            }
          });
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

}
