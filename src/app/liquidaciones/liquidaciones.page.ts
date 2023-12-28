import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { ClienteService } from '../services/cliente.service';
import { GranjaService } from '../services/granja.service';
import { GalponService } from '../services/galpon.service';
import { LotesService } from '../services/lotes.service';
import { LiquidacionesService } from '../services/liquidaciones.service';
import { ListasService } from '../services/listas.service';
import { Listas } from '../interfaces/listas';
import { LiquidacionesModalComponent } from '../components/liquidaciones-modal/liquidaciones-modal.component';
import { ModalController } from '@ionic/angular';
import { CalculosInfoSemanalService } from '../services/calculos-info-semanal.service';
import { Rol } from '../interfaces/rol';
import { Planta } from '../interfaces/planta';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';

function createRangeValidator(min: number, max: number, errorKey: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === '' || value === undefined) {
      return null;
    }
    if (value < min || value > max) {
      return { [errorKey]: true };
    }
    return null;
  };
}

const validatePreinicio = createRangeValidator(140, 350, 'PreinicioInvalid');
const validateInicio = createRangeValidator(650, 1600, 'InicioInvalid');
const validateEngorde = createRangeValidator(1100, 6000, 'EngordeInvalid');
const validateDias = createRangeValidator(0, 60, 'EdadSacrificioInvalid');


@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.page.html',
  styleUrls: ['./liquidaciones.page.scss'],
})
export class LiquidacionesPage implements OnInit {
  segmentValue: string = 'listado_liquidaciones';
  searchTerm: string = '';
  edit:boolean = false;
  idLiquidaciones:number

  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[];
  listaLotes:any[];
  listaLiquidaciones:any[];
  listaTemp:any[]=[];
  listaTipoMoneda:any[]=[];
  listaMarcaAlimento:any[]=[];

  selectedLoteNumAvesEncasetadas: number;

  constructor(
    private _fb:FormBuilder,
    private _auth:AuthService,
    private _alerts:AlertsService,
    private _chRef: ChangeDetectorRef,
    private _clienteService:ClienteService,
    private _granjaService:GranjaService,
    private _galponService:GalponService,
    private _loteService:LotesService,
    private _liquidacionService:LiquidacionesService,
    private _listasService:ListasService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
    private _calculoService:CalculosInfoSemanalService,
    private modalCtrl: ModalController
  ) { }

  LiquidacionesForm:FormGroup = this._fb.group({
    idLote: [null,[Validators.required]],
    edadSacrificio: [null,[Validators.required, validateDias]],
    pesoPromedio: [null,[Validators.required]],
    idMonedaLista: [null,[Validators.required]],
    precioAlimentoPreinicio: [null,[Validators.required]],
    consumoAcumuladoPreinicio: [null,[Validators.required, validatePreinicio]],
    idMarcaAlimentoPreinicioLista: [null,[Validators.required]],
    precioAlimentoInicio: [null,[Validators.required]],
    consumoAcumuladoInicio: [null,[Validators.required, validateInicio]],
    idMarcaAlimentoInicioLista: [null,[Validators.required]],
    precioAlimentoEngorde: [null,[Validators.required]],
    consumoAcumuladoEngorde: [null,[Validators.required, validateEngorde]],
    idMarcaAlimentoEngordeLista: [null,[Validators.required]],
    totalAvesMuertasCiclo: [null,[Validators.required, this.validateNumAvesEcansetadas.bind(this)]],
    totalAvesSeleccionCiclo: [null,[Validators.required, this.validateNumAvesEcansetadas.bind(this)]],
    precioVentaPollo: [null,[Validators.required]],
    observacion: ["",[Validators.required]],  
  })

  ngOnInit() {
    this.getListClientes();
    this.GetListaTipoMoneda();
    this.GetListaMarcaAlimento();

    this.LiquidacionesForm.get('idLote').valueChanges.subscribe(selectedLoteId => {
      const selectedLote = this.listaLotes.find(lote => lote.id === selectedLoteId);
      if (selectedLote) {
        this.selectedLoteNumAvesEncasetadas = selectedLote.numAvesEncasetadas;
        console.log("Numero de Aves Encasetadas: ", selectedLote.numAvesEncasetadas)
      }
    });
  }


  validateNumAvesEcansetadas(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!control.value) {
      return null;
    }
    if (value > this.selectedLoteNumAvesEncasetadas) {
      return { 'numAvesInvalid': true };
    }
    return null;
  }

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaLiquidaciones = [...this.listaTemp];
    this.listaLiquidaciones = this.listaLiquidaciones.filter((d:any) => 
    d.edadSacrificio.toString().indexOf(query) > -1 || 
    d.pesoPromedio.toString().indexOf(query) > -1 || 
    d.totalAvesMuertasCiclo.toString().indexOf(query) > -1 ||
    d.totalAvesSeleccionCiclo.toString().indexOf(query) > -1
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaLiquidaciones = [...this.listaTemp];
  }

  
  sortBy(criteria: string) {
    if (criteria === 'edad_sacrificio') {
      this.listaLotes.sort((a, b) => (a.edadSacrificio > b.edadSacrificio) ? 1 : -1);
    } else if (criteria === 'peso_promedio') {
      this.listaLotes.sort((a, b) => (a.pesoPromedio > b.pesoPromedio) ? 1 : -1);
    } else if (criteria === 'totalAvesMuertasCiclo') {
      this.listaLotes.sort((a, b) => (a.totalAvesMuertasCiclo > b.totalAvesMuertasCiclo) ? 1 : -1);
    } else if (criteria === 'totalAvesSeleccionCiclo') {
      this.listaLotes.sort((a, b) => (a.totalAvesSeleccionCiclo > b.totalAvesSeleccionCiclo) ? 1 : -1);
    }
  }

  async obtenerRoles(): Promise<Rol[]> {
    return new Promise((resolve, reject) => {
      this._rolService.getListaRoles().subscribe((data: any) => {
        if (data.error) {
          console.error(data.message);
          reject(data.message);
        } else {
          resolve(data.result as Rol[]); // Esto asume que data.result es un array de tipo 'Rol'
        }
      });
    });
  }
  
async obtenerPlantaPorUsuario(idUsuario: number): Promise<Planta> {
  return new Promise((resolve, reject) => {
    this._plantaService.GetPlantaByIdUser(idUsuario).subscribe((dataPlanta: any) => {
      if (dataPlanta.error) {
        console.error(`Error:${dataPlanta.message} - code: ${dataPlanta.codError} - ${dataPlanta.result}`);
        reject(dataPlanta.message);
      } else {
        resolve(dataPlanta.result as Planta); // Esto asume que dataPlanta.result es de tipo 'Planta'
      }
    });
  });
}

async getListClientes() {
  const usuarioActual = this._auth.getUser();
  try {
    const listaRoles = await this.obtenerRoles();
    const nombre_rol = listaRoles.find(rol => rol.id === usuarioActual.Rol);
    usuarioActual.RolText = nombre_rol.nombre;
    const planta = await this.obtenerPlantaPorUsuario(usuarioActual.Id);
    if (planta && planta.nombre) {
      usuarioActual.Planta = planta.id;
      console.log(planta);
    } else {
      console.error('El resultado no tiene una propiedad nombre válida.');
    }
    this._clienteService.getListaClientes().subscribe((dataClientes: any) => {
      if (dataClientes.error) {
        console.error(dataClientes.message);
      } else {
        this.listaTemp = dataClientes.result;
        if (usuarioActual.RolText === 'Administrador') {
          this.listaClientes = this.listaTemp;
        } else {
          this.listaClientes = this.listaTemp.filter(cliente =>
            cliente.idPlantas.some(planta => planta.id === usuarioActual.Planta)
          );
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

getGranjas(event:any){
  let idCliente = event.detail.value;
  this._granjaService.getGranjaByIdCliente(idCliente).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaGranjas = data.result;
      console.log(this.listaGranjas)
      this._chRef.detectChanges();
    }
  })
}

getGalpones(event:any){
  let idGranja = event.detail.value;
  this._galponService.getGalponByIdGranja(idGranja).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaGalpones = data.result;
      console.log(this.listaGalpones)
      this._chRef.detectChanges();
    }
  })
}

getLotes(event:any){
  let idGalpon = event.detail.value;
  this._loteService.getLoteByIdGalpon(idGalpon).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaLotes = data.result;
      console.log(this.listaLotes)
      this._chRef.detectChanges();
    }
  })
}

getListaLiquidaciones(event:any){
  let idLote = event.detail.value;
  this._liquidacionService.getLiquidacionByLote(idLote).subscribe((data:any)=>{
    if (data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
    }else{
      this.listaTemp = data.result;
      this.listaLiquidaciones = data.result.map(item => {
        return { ...item, idLote: idLote }
      });
      console.log(this.listaLiquidaciones)
      this._chRef.detectChanges();
    }
  })

}

GetListaTipoMoneda(){
  this._listasService.getListas(Listas.moneda).subscribe((data:any)=>{
    if(data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
    }else{
      this.listaTipoMoneda = data.result
      // console.log(this.listalineaGenetica)
    }
  })
}

GetListaMarcaAlimento(){
  this._listasService.getListas(Listas.marcaAlimento).subscribe((data:any)=>{
    if(data.error){
      console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
    }else{
      this.listaMarcaAlimento = data.result
      // console.log(this.listalineaGenetica)
    }
  })
}

SaveOrUpdate(){
  if(this.edit==true){
    // this.ActualizarLote();
  }else{
    this.RegistrarLiquidaciones();
  }
}

RegistrarLiquidaciones(){
  if (this.LiquidacionesForm.valid){
    let data = this.LiquidacionesForm.value;
    data.id_Usuario_Registro = this._auth.getUser().Id;
    console.log(data)
    this._liquidacionService.createLiquidaciones(data).subscribe((data:any)=>{
      if(data.error){
        this._alerts.presentToast("top",data.message,"warning");
      }else{
        this._alerts.presentToast("top","Lote Liquidado Exitosamente","success");
        this.LiquidacionesForm.reset();
        this.segmentValue = 'listado_liquidaciones';  
        // Añadir el nuevo galpón al array
        if (data.newLiquidacion) {
          this.listaLiquidaciones.push(data.newLiquidacion);
        }
      }
    });
  }
}

async MostrarModalLiquidacion(idLiquidacion: number, idLote: number) {
  const liquidacionSeleccionada = this.listaLiquidaciones.find(liquidacion => liquidacion.id === idLiquidacion);
  const loteSeleccionado = this.listaLotes.find(lote => lote.id === idLote);
  
  if (liquidacionSeleccionada && loteSeleccionado) {
    const alimentoPreinicio = this.listaMarcaAlimento.find(marcaAlimento => marcaAlimento.id === liquidacionSeleccionada.idMarcaAlimentoPreinicioLista);
    const alimentoInicio = this.listaMarcaAlimento.find(marcaAlimento => marcaAlimento.id === liquidacionSeleccionada.idMarcaAlimentoInicioLista);
    const alimentoEngorde = this.listaMarcaAlimento.find(marcaAlimento => marcaAlimento.id === liquidacionSeleccionada.idMarcaAlimentoEngordeLista);
    const consumoAcumTotal = liquidacionSeleccionada.consumoAcumuladoPreinicio + liquidacionSeleccionada.consumoAcumuladoInicio + liquidacionSeleccionada.consumoAcumuladoEngorde;
    const conversionAlimenticia = consumoAcumTotal/liquidacionSeleccionada.pesoPromedio;
    const gananciaDiariaProm = liquidacionSeleccionada.pesoPromedio/liquidacionSeleccionada.edadSacrificio;
    const porcMortalidad = (liquidacionSeleccionada.totalAvesMuertasCiclo/loteSeleccionado.numAvesEncasetadas)*100;
    const porcSeleccion = (liquidacionSeleccionada.totalAvesSeleccionCiclo/loteSeleccionado.numAvesEncasetadas)*100;
    const porcSobrevivencia = 100-porcMortalidad;
    const porcMortalidadSeleccion = porcMortalidad + porcSeleccion;
    const totAvesFinales = loteSeleccionado.numAvesEncasetadas-liquidacionSeleccionada.totalAvesMuertasCiclo-liquidacionSeleccionada.totalAvesSeleccionCiclo;
    const precioPonderado = this._calculoService.calcPrecioPonderado(
      liquidacionSeleccionada.consumoAcumuladoPreinicio, liquidacionSeleccionada.precioAlimentoPreinicio,
      liquidacionSeleccionada.consumoAcumuladoInicio, liquidacionSeleccionada.precioAlimentoInicio,
      liquidacionSeleccionada.consumoAcumuladoEngorde, liquidacionSeleccionada.precioAlimentoEngorde,consumoAcumTotal);
    const costoAlimentoAve = (precioPonderado * consumoAcumTotal)/1000;
    const costoAlimentoPolloProducido = costoAlimentoAve / (liquidacionSeleccionada.pesoPromedio / 1000);
    const ingresoBrutoKgPollo =liquidacionSeleccionada.precioVentaPollo - costoAlimentoPolloProducido;
    const eficienciaAmericana = liquidacionSeleccionada.pesoPromedio/10/conversionAlimenticia;
    const IP = eficienciaAmericana / conversionAlimenticia;
    const eficienciaEuropea = (porcSobrevivencia * liquidacionSeleccionada.pesoPromedio*0.1)/(liquidacionSeleccionada.edadSacrificio * conversionAlimenticia);

    const modal = await this.modalCtrl.create({
      component: LiquidacionesModalComponent,
      componentProps: {
        liquidacion: liquidacionSeleccionada,
        alimentoPreinicio,
        alimentoInicio,
        alimentoEngorde,
        consumoAcumTotal,
        conversionAlimenticia,
        gananciaDiariaProm,
        porcMortalidad,
        porcSeleccion,
        porcSobrevivencia,
        porcMortalidadSeleccion,
        totAvesFinales,
        precioPonderado,
        costoAlimentoAve,
        costoAlimentoPolloProducido,
        ingresoBrutoKgPollo,
        eficienciaAmericana,
        IP,
        eficienciaEuropea
      }
    });
    return await modal.present();
  }
}

}
