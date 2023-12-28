import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GranjasPage } from './granjas.page';

const routes: Routes = [
  {
    path: '',
    component: GranjasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GranjasPageRoutingModule {}
