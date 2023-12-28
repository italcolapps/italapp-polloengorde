import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RepInfoProdSemanalPageRoutingModule } from './rep-info-prod-semanal-routing.module';

import { RepInfoProdSemanalPage } from './rep-info-prod-semanal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepInfoProdSemanalPageRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  declarations: [RepInfoProdSemanalPage]
})
export class RepInfoProdSemanalPageModule {}
