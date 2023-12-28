import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrls: ['./usuario-modal.component.scss'],
})
export class UsuarioModalComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  @Input() usuario: any;

  ngOnInit() {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
