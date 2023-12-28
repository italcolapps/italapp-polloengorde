import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionProductivaPage } from './informacion-productiva.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionProductivaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionProductivaPageRoutingModule {}
