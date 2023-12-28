import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-liquidaciones-modal',
  templateUrl: './liquidaciones-modal.component.html',
  styleUrls: ['./liquidaciones-modal.component.scss'],
})
export class LiquidacionesModalComponent  implements OnInit {

  @Input() liquidacion: any;
  @Input() alimentoPreinicio: any;
  @Input() alimentoInicio: any;
  @Input() alimentoEngorde: any;
  @Input() consumoAcumTotal: any;
  @Input() conversionAlimenticia: any;
  @Input() gananciaDiariaProm: any;
  @Input() porcMortalidad: any;
  @Input() porcSeleccion: any;
  @Input() porcSobrevivencia: any;
  @Input() porcMortalidadSeleccion: any;
  @Input() totAvesFinales: any;
  @Input() precioPonderado: any;
  @Input() costoAlimentoAve: any;
  @Input() costoAlimentoPolloProducido: any;
  @Input() ingresoBrutoKgPollo: any;
  @Input() eficienciaAmericana: any;
  @Input() IP: any;
  @Input() eficienciaEuropea: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }


}
