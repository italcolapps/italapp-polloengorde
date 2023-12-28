import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOCALE_ID } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RepLiquidacionesPageRoutingModule } from './rep-liquidaciones-routing.module';

import { RepLiquidacionesPage } from './rep-liquidaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepLiquidacionesPageRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    // ... otros providers ...
  ],
  declarations: [RepLiquidacionesPage]
})
export class RepLiquidacionesPageModule {}
