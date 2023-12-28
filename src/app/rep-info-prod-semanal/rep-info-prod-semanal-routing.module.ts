import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepInfoProdSemanalPage } from './rep-info-prod-semanal.page';

const routes: Routes = [
  {
    path: '',
    component: RepInfoProdSemanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepInfoProdSemanalPageRoutingModule {}
