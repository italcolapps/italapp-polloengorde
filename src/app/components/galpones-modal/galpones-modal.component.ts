import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-galpones-modal',
  templateUrl: './galpones-modal.component.html',
  styleUrls: ['./galpones-modal.component.scss'],
})
export class GalponesModalComponent  implements OnInit {
  area: number;

  constructor(
    private modalCtrl: ModalController
  ) { 
    
  }

  @Input() galpon: any;
  

  ngOnInit() {
    if (this.galpon && this.galpon.largo && this.galpon.ancho) {
      this.area = this.galpon.largo * this.galpon.ancho;
    }
  }




  cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
