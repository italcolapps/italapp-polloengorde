import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalponesPage } from './galpones.page';

const routes: Routes = [
  {
    path: '',
    component: GalponesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalponesPageRoutingModule {}
