import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { UsuarioModalComponent } from '../components/usuario-modal/usuario-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    ReactiveFormsModule
    
  ],
  declarations: [UsuariosPage, UsuarioModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosPageModule {}
