import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListasService } from '../services/listas.service';
import { LotesService } from '../services/lotes.service';
import { GalponService } from '../services/galpon.service';
import { GranjaService } from '../services/granja.service';
import { ClienteService } from '../services/cliente.service';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SeguimientoSemanalService } from '../services/seguimiento-semanal.service';
import { Listas } from '../interfaces/listas';
import { ModalController } from '@ionic/angular';
import { SeguimientoSemanalModalComponent } from '../components/seguimiento-semanal-modal/seguimiento-semanal-modal.component';
import { LiquidacionesModalComponent } from '../components/liquidaciones-modal/liquidaciones-modal.component';
import { CalculosInfoSemanalService } from '../services/calculos-info-semanal.service';
import { Planta } from '../interfaces/planta';
import { Rol } from '../interfaces/rol';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';


@Component({
  selector: 'app-informacion-productiva',
  templateUrl: './informacion-productiva.page.html',
  styleUrls: ['./informacion-productiva.page.scss'],
})
export class InformacionProductivaPage implements OnInit {
  segmentValue: string = 'listado_infoproductiva';
  searchTerm: string = '';
  edit:boolean = false;
  idInfoProductiva:number

  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[];
  listaLotes:any[];
  listaInfoProductiva:any[];
  listaTemp:any[]=[];
  listaSemanas:any[]=[];
  listaFaseAlimentacion:any[]=[];
  listaMarcaAlimento:any[]=[];
  listaSexo:any=[]

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
    private _infoProdService:SeguimientoSemanalService,
    private _listasService:ListasService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
    private modalCtrl: ModalController,
    private calculos_semanales: CalculosInfoSemanalService
  ) { }

  ngOnInit() {
    this.getListClientes();
    this.GetListaSemanas();
    this.GetListaFasesAlimentacion();
    this.GetListaMarcaAlimento();

    this.InfoProductivaForm.get('idLote').valueChanges.subscribe(selectedLoteId => {
      const selectedLote = this.listaLotes.find(lote => lote.id === selectedLoteId);
      if (selectedLote) {
        this.selectedLoteNumAvesEncasetadas = selectedLote.numAvesEncasetadas;
        console.log("Numero de Aves Encasetadas: ", selectedLote.numAvesEncasetadas)
      }
    });
  }

  validateNumAvesEcansetadas(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === '' || value === undefined) {
      return null;
    }
    if (value > this.selectedLoteNumAvesEncasetadas) {
      return { 'numAvesInvalid': true };
    }
    return null;
  }



  InfoProductivaForm:FormGroup = this._fb.group({
    idLote: [null,[Validators.required]],
    idSemanaSeguimiento: [null,[Validators.required]],
    pesoPromedio: [null,[Validators.required]],
    consumoAcumulado: [null,[Validators.required]],
    idFaseAlimentacion: [null,[Validators.required]],
    mortalidadAcumulada: [null, [Validators.required, this.validateNumAvesEcansetadas.bind(this)]],
    seleccionAcumulada: [null, [Validators.required, this.validateNumAvesEcansetadas.bind(this)]],
    idMarcaAlimento: [null,[Validators.required]],
    observacion: ["",[Validators.required]],  
  }
  )
  

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaInfoProductiva = [...this.listaTemp];
    this.listaInfoProductiva = this.listaInfoProductiva.filter((d:any) => 
    d.edadDias.toString().indexOf(query) > -1 || 
    d.faseAlimentacion.toLowerCase().indexOf(query) > -1 ||
    d.marcaAlimento.toLowerCase().indexOf(query) > -1
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaInfoProductiva = [...this.listaTemp];
  }

  sortBy(criteria: string) {
    if (criteria === 'edad') {
      this.listaInfoProductiva.sort((a, b) => (a.edadDias > b.edadDias) ? 1 : -1);
    } else if (criteria === 'fase_alimentacion') {
      this.listaInfoProductiva.sort((a, b) => (a.faseAlimentacion > b.faseAlimentacion) ? 1 : -1);
    } else if (criteria === 'marca_alimento') {
      this.listaInfoProductiva.sort((a, b) => (a.marcaAlimento > b.marcaAlimento) ? 1 : -1);
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

  getListaInfoProductiva(event:any){
    let idLote = event.detail.value;
    this._infoProdService.getInfoProductivaByLote(idLote).subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      }else{
        this.listaTemp = data.result;
        this.listaInfoProductiva = data.result.map(item => {
          return { ...item, idLote: idLote }
        });
        console.log(this.listaInfoProductiva)
        this._chRef.detectChanges();
      }
    })
  }

  GetSexo(){
    this._listasService.getListas(Listas.sexo).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaSexo = data.result
        // console.log(this.listaSexo)
      }
    })
  }

  GetListaSemanas(){
    this._listasService.getListas(Listas.Edad).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaSemanas = data.result
        // console.log(this.listalineaGenetica)
      }
    })
  }

  GetListaFasesAlimentacion(){
    this._listasService.getListas(Listas.faseAlimentacion).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaFaseAlimentacion = data.result
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
      this.RegistrarInfoProductiva();
    }
  }

RegistrarInfoProductiva(){
  if (this.InfoProductivaForm.valid){
    let data = this.InfoProductivaForm.value;
    let loteSeleccionado = this.listaLotes.find(lote => lote.id === data.idLote);  // Buscar el lote seleccionado

    if (loteSeleccionado) {  // Verificar que el lote existe
      // Comparar mortalidad acumulada con el número de aves encasetadas
      if (data.mortalidadAcumulada > loteSeleccionado.numAvesEncasetadas) {
        // Mostrar alerta o mensaje
        this._alerts.presentToast("top", "La mortalidad acumulada no puede ser mayor que el número de aves encasetadas", "warning");
        return;  
      }

      data.edadDias = this._listasService.calcularEdadPorSemana(data.idSemanaSeguimiento);
      data.idUsuarioRegistro = this._auth.getUser().Id;
      console.log(data)
      this._infoProdService.createInfoProductiva(data).subscribe((data:any)=>{
        if(data.error){
          this._alerts.presentToast("top",data.message,"warning");
        }else{
          this._alerts.presentToast("top","Registro Creado con Exito","success");
          this.InfoProductivaForm.reset();
          this.segmentValue = 'listado_infoproductiva';  
          // Añadir el nuevo seguimiento al array
          if (data.newInfoProductiva) {
            this.listaInfoProductiva.push(data.newInfoProductiva);
          }
        }
      });
    }
  }
}


  async MostrarModaInfoProductiva(idInfoProductiva: number, idLote: number) {
    const infoProdSeleccionada = this.listaInfoProductiva.find(info => info.id === idInfoProductiva);
    const loteSeleccionado = this.listaLotes.find(lote => lote.id === idLote);
  
    if (infoProdSeleccionada && loteSeleccionado) {
      const VPI = infoProdSeleccionada.pesoPromedio/loteSeleccionado.pesoInicial;
      const conversionAlimenticia = infoProdSeleccionada.consumoAcumulado/infoProdSeleccionada.pesoPromedio;
      const infoProdSemanaAnterior = this.listaInfoProductiva.find(info => info.edadDias === (infoProdSeleccionada.edadDias - 7));
      let GananciaDuranteSemana = 0;
      if (infoProdSemanaAnterior) {
        GananciaDuranteSemana = (infoProdSeleccionada.pesoPromedio - infoProdSemanaAnterior.pesoPromedio) / 7;
      }
      const GananciaDiariaAcumulada = infoProdSeleccionada.pesoPromedio/infoProdSeleccionada.edadDias;
      const porcMortalidad = (infoProdSeleccionada.mortalidadAcumulada/loteSeleccionado.numAvesEncasetadas)*100;
      const porcSeleccion = (infoProdSeleccionada.seleccionAcumulada /loteSeleccionado.numAvesEncasetadas)*100;
      const porcMortalidadSeleccion = porcMortalidad + porcSeleccion;
      
      const modal = await this.modalCtrl.create({
        component: SeguimientoSemanalModalComponent,
        componentProps: {
          info: infoProdSeleccionada,
          VPI,
          conversionAlimenticia,
          GananciaDuranteSemana,
          GananciaDiariaAcumulada,
          porcMortalidad,
          porcSeleccion,
          porcMortalidadSeleccion
        }
      });
      return await modal.present();
    }
  }
  


  goBack() {
    this.InfoProductivaForm.reset();
    this.segmentValue = 'listado_lotes';
  }

  resetForm() {
    this.InfoProductivaForm.reset();
  }

}
