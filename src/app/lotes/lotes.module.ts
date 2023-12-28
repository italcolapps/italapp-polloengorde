import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotesPageRoutingModule } from './lotes-routing.module';

import { LotesPage } from './lotes.page';
import { LotesModalComponent } from '../components/lotes-modal/lotes-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LotesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LotesPage, LotesModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LotesPageModule {}
