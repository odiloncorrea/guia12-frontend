import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TipoComponent } from './pages/tipo/tipo.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { AddProdutoComponent } from './pages/add-produto/add-produto.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { AddPedidoComponent } from './pages/add-pedido/add-pedido.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'tipos', component: TipoComponent },
  { path: 'produtos', component: ProdutoComponent, },
  { path: 'add-produto', component: AddProdutoComponent },
  { path: 'add-produto/:id', component: AddProdutoComponent },
  { path: '', component: LoginComponent },
  { path: 'usuarios', component: UsuarioComponent, },
  { path: 'add-usuario', component: AddUsuarioComponent },
  { path: 'pedidos', component: PedidoComponent, },
  { path: 'add-pedido', component: AddPedidoComponent },
  { path: 'add-pedido/:id', component: AddPedidoComponent },  
];
