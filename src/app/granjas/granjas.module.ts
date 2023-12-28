import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GranjasPageRoutingModule } from './granjas-routing.module';

import { GranjasPage } from './granjas.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GranjaModalComponent } from '../components/granja-modal/granja-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GranjasPageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [Geolocation],
  declarations: [GranjasPage, GranjaModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GranjasPageModule {}
