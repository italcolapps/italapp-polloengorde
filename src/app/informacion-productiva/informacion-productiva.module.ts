import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionProductivaPageRoutingModule } from './informacion-productiva-routing.module';

import { InformacionProductivaPage } from './informacion-productiva.page';
import { SeguimientoSemanalModalComponent } from '../components/seguimiento-semanal-modal/seguimiento-semanal-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionProductivaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [InformacionProductivaPage, SeguimientoSemanalModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InformacionProductivaPageModule {}
