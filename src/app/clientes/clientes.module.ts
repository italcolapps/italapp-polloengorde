import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { ClienteModalComponent } from '../components/cliente-modal/cliente-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    ReactiveFormsModule
  ],
  
  declarations: [ClientesPage,  ClienteModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientesPageModule {}
