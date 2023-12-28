import { Component, OnInit, Input  } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.scss'],
})
export class ClienteModalComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  @Input() cliente: any;

  ngOnInit() {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
