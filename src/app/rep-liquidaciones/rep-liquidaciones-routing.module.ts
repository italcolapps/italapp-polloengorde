import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { RepLiquidacionesPage } from './rep-liquidaciones.page';

const routes: Routes = [
  {
    path: '',
    component: RepLiquidacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepLiquidacionesPageRoutingModule {}
