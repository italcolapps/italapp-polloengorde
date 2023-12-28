import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lotes-modal',
  templateUrl: './lotes-modal.component.html',
  styleUrls: ['./lotes-modal.component.scss'],
})
export class LotesModalComponent  implements OnInit {

  @Input() lote: any;
  @Input() lineaGenetica: any;
  @Input() incubadora: any;
  @Input() sexo: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
