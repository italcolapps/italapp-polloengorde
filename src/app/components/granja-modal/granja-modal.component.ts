import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-granja-modal',
  templateUrl: './granja-modal.component.html',
  styleUrls: ['./granja-modal.component.scss'],
})
export class GranjaModalComponent  implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  @Input() granja: any;

  ngOnInit() {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
