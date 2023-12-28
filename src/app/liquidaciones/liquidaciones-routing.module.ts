import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionesPage } from './liquidaciones.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidacionesPageRoutingModule {}
