import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReportesService } from '../services/reportes.service';
import { LotesService } from '../services/lotes.service';
import { GalponService } from '../services/galpon.service';
import { GranjaService } from '../services/granja.service';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';
import { Rol } from '../interfaces/rol';
import { Planta } from '../interfaces/planta';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {


  constructor(

  ) { }

  ngOnInit() {
  }

}
