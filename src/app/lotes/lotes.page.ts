import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ListasService } from '../services/listas.service';
import { GalponService } from '../services/galpon.service';
import { GranjaService } from '../services/granja.service';
import { ClienteService } from '../services/cliente.service';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { LotesService } from '../services/lotes.service';
import { Listas } from '../interfaces/listas';
import { ModalController } from '@ionic/angular';
import { LotesModalComponent } from '../components/lotes-modal/lotes-modal.component';
import { PlantaService } from '../services/planta.service';
import { RolesService } from '../services/roles.service';
import { Planta } from '../interfaces/planta';
import { Rol } from '../interfaces/rol';

function validateNumAves(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '' || value === undefined) {
    return null;
  }
  if (value < 100) {
    return { 'numAvesInvalid': true };
  }
  return null;
}

function validatePeso(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '' || value === undefined) {
    return null;
  }
  if (value < 30 || value > 50) {
    return { 'pesoInvalid': true };
  }
  return null;
}

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.page.html',
  styleUrls: ['./lotes.page.scss'],
})
export class LotesPage implements OnInit {
  segmentValue: string = 'listado_lotes';
  searchTerm: string = '';
  edit:boolean = false;
  idLote:number

  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[]
  listaLotes:any[]
  listaTemp:any[]=[];
  listalineaGenetica:any=[]
  listaSexo:any=[]
  listaIncubadoras:any=[]

  constructor(
    private _fb:FormBuilder,
    private _auth:AuthService,
    private _alerts:AlertsService,
    private _chRef: ChangeDetectorRef,
    private _clienteService:ClienteService,
    private _granjaService:GranjaService,
    private _galponService:GalponService,
    private _loteService:LotesService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
    private _listasService:ListasService,
    private modalCtrl: ModalController
  ) {
    
    }

  ngOnInit() {
    this.getListClientes();
    this.GetLineaGenetica();
    this.GetSexo();
    this.GetListaIncubadora();
  }

  LotesForm:FormGroup = this._fb.group({
    nombre: ["",[Validators.required]],  
    idLineaGenetica: [null,[Validators.required]],  
    idSexo: [null,[Validators.required]],  
    idIncubadora: [null,[Validators.required]],  
    loteReproductora: ['',[Validators.required]],  
    numAvesEncasetadas: [null,[Validators.required, validateNumAves]],  
    pesoInicial: [null,[Validators.required, validatePeso]],  
    idGalpon: [null,[Validators.required]],
    fechaRegistroInicio: ['', Validators.required],  
  })

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaLotes = [...this.listaTemp];
    this.listaLotes = this.listaLotes.filter((d:any) => 
    d.codLote.toLowerCase().indexOf(query) > -1 || 
    d.nombre.toLowerCase().indexOf(query) > -1 ||
    d.fechaRegistroInicio.toString().indexOf(query) > -1
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaLotes = [...this.listaTemp];
  }

  sortBy(criteria: string) {
    if (criteria === 'codLote') {
      this.listaLotes.sort((a, b) => (a.codLote > b.codLote) ? 1 : -1);
    } else if (criteria === 'nombre') {
      this.listaLotes.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
    } else if (criteria === 'fechaRegistroInicio') {
      this.listaLotes.sort((a, b) => (a.fechaRegistroInicio > b.fechaRegistroInicio) ? 1 : -1);
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
        this.listaTemp = data.result;
        this.listaLotes = data.result;
        console.log(this.listaLotes)
        this._chRef.detectChanges();
      }
    })
  }

  GetLineaGenetica(){
    this._listasService.getListas(Listas.lineaGenetica).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listalineaGenetica = data.result
        // console.log(this.listalineaGenetica)
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

  GetListaIncubadora(){
    this._listasService.getListas(Listas.incubadora).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaIncubadoras = data.result
        // console.log(this.listaIncubadoras)
      }
    })
  }
  

  SaveOrUpdate(){
    if(this.edit==true){
      this.ActualizarLote();
    }else{
      this.RegistrarLotes();
    }
  }
  

  
  RegistrarLotes(){
    if (this.LotesForm.valid){
      let data = this.LotesForm.value;
      data.idUsuarioRegistro = this._auth.getUser().Id;
      console.log(data)
      this._loteService.createlote(data).subscribe((data:any)=>{
        if(data.error){
          this._alerts.presentToast("top",data.message,"warning");
        }else{
          this._alerts.presentToast("top","Lote Creado con Exito","success");
          this.LotesForm.reset();
          this.segmentValue = 'listado_lotes';  
          // Añadir el nuevo galpón al array
          if (data.newLote) {
            this.listaLotes.push(data.newLote);
          }
        }
      });
    }
  }

  ActualizarLote(){
    let data = this.LotesForm.value;
    data.idUsuarioRegistro = this._auth.getUser().Id;
    console.log(data)
    this._loteService.updateLote(this.idLote,data).subscribe((data:any)=>{
      if(data.error){
        this._alerts.warning(data.message,"Atencion");
      }else{
        this.LotesForm.reset();
        this.segmentValue = 'listado_lotes';
        if(this._alerts.success("Lote Actualizado con Éxito")){
          if (data.newLote) {
            this.listaLotes.push(data.newLote);
          }
        }
      }
    })
  }

  MostrarDatosLote(idLote:number){
    this.edit=true
    this.idLote=idLote
    const loteSeleccionado = this.listaLotes.find(lote => lote.id === idLote);
    console.log(loteSeleccionado)
    if (loteSeleccionado){
      this.segmentValue = 'registro_lotes'
      this.LotesForm.patchValue({
        fechaRegistroInicio: loteSeleccionado.fechaRegistroInicio,
        nombre: loteSeleccionado.nombre,
        idLineaGenetica: loteSeleccionado.idLineaGeneticaLista,
        idSexo: loteSeleccionado.idSexoLista,
        idIncubadora: loteSeleccionado.idIncubadoraLista,
        loteReproductora: loteSeleccionado.idIncubadoraLista,
        numAvesEncasetadas: loteSeleccionado.numAvesEncasetadas,
        pesoInicial: loteSeleccionado.pesoInicial,
    });
    }
  }

  async MostrarModalLote(idLote: number) {
    const loteSeleccionado = this.listaLotes.find(lote => lote.id === idLote);
    if (loteSeleccionado) {
      const lineaGeneticaSeleccionada = this.listalineaGenetica.find(lineaGenetica => lineaGenetica.id === loteSeleccionado.idLineaGeneticaLista);
      const incubadoraSeleccionada = this.listaIncubadoras.find(incubadora => incubadora.id === loteSeleccionado.idIncubadoraLista);
      const sexoSeleccionado = this.listaSexo.find(sexo => sexo.id === loteSeleccionado.idSexoLista);
      const modal = await this.modalCtrl.create({
        component: LotesModalComponent,
        componentProps: {
          lote: loteSeleccionado,
          incubadora: incubadoraSeleccionada,
          sexo: sexoSeleccionado,
          lineaGenetica:lineaGeneticaSeleccionada
        }
      });
      return await modal.present();
    }
  }
    
  goBack() {
    this.LotesForm.reset();
    this.segmentValue = 'listado_lotes';
  }

  resetForm() {
    this.LotesForm.reset();
  }

}
