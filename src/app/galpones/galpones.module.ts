import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalponesPageRoutingModule } from './galpones-routing.module';

import { GalponesPage } from './galpones.page';
import { GalponesModalComponent } from '../components/galpones-modal/galpones-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GalponesPageRoutingModule
  ],
  declarations: [GalponesPage, GalponesModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GalponesPageModule {}
