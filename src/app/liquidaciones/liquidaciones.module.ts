import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidacionesPageRoutingModule } from './liquidaciones-routing.module';

import { LiquidacionesPage } from './liquidaciones.page';
import { LiquidacionesModalComponent } from '../components/liquidaciones-modal/liquidaciones-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiquidacionesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LiquidacionesPage, LiquidacionesModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LiquidacionesPageModule {}
