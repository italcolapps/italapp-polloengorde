import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-seguimiento-semanal-modal',
  templateUrl: './seguimiento-semanal-modal.component.html',
  styleUrls: ['./seguimiento-semanal-modal.component.scss'],
})
export class SeguimientoSemanalModalComponent  implements OnInit {

  @Input() info: any;
  @Input() VPI: number; 
  @Input() conversionAlimenticia: number; 
  @Input() GananciaDuranteSemana: number; 
  @Input() GananciaDiariaAcumulada: number; 
  @Input() porcMortalidad: number; 
  @Input() porcSeleccion: number; 
  @Input() porcMortalidadSeleccion: number; 

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }


}
