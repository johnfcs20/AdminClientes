
import { ListaClientesComponent } from './cliente/lista-clientes/lista-clientes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'lista-clientes', pathMatch: 'full'},
  {path: 'lista-clientes', component: ListaClientesComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
