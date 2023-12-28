import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { GranjaService } from '../services/granja.service';
import { GalponService } from '../services/galpon.service';
import { ListasService } from '../services/listas.service';
import { Listas } from '../interfaces/listas';
import { ModalController, NavController } from '@ionic/angular';
import { GalponesModalComponent } from '../components/galpones-modal/galpones-modal.component';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';
import { Planta } from '../interfaces/planta';
import { Rol } from '../interfaces/rol';

@Component({
  selector: 'app-galpones',
  templateUrl: './galpones.page.html',
  styleUrls: ['./galpones.page.scss'],
})
export class GalponesPage implements OnInit {
  segmentValue: string = 'listado_galpones';
  searchTerm: string = '';
  edit:boolean = false;
  idGalpon:number
  public area: number = null;

  listaClientes:any=[];
  listaGranjas:any=[];
  listaGalpones:any[] = [];
  listaTemp:any[]=[];
  listaTipoGalpon:any[]=[]

  constructor(
    private _fb:FormBuilder,
    private _routerNav:Router,
    private _auth:AuthService,
    private _alerts:AlertsService,
    private _chRef: ChangeDetectorRef,
    private _clienteService:ClienteService,
    private _granjaService:GranjaService,
    private _galponService:GalponService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
    private _listasService:ListasService,
    private modalCtrl: ModalController
  ) {
    this.GalponesForm.get('largo').valueChanges.subscribe(() => {
      this.calculateArea();
    });
  
    this.GalponesForm.get('ancho').valueChanges.subscribe(() => {
      this.calculateArea();
    });
    }

  ngOnInit() {
    this.getListClientes();
    this.GetTipoGalpon();
  }

  GalponesForm:FormGroup = this._fb.group({
    nombre: ["",[Validators.required]],  
    largo: [null,[Validators.required]],
    ancho: [null,[Validators.required]], 
    idGranja: [null,[Validators.required]], 
    idTipoGalpon: [null,[Validators.required]],  
  })

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaGalpones = [...this.listaTemp];
    this.listaGalpones = this.listaGalpones.filter((d:any) => 
    d.nombre.toLowerCase().indexOf(query) > -1 || 
    d.tipogalpon.toLowerCase().indexOf(query) > -1 ||
    d.id.toString().indexOf(query) > -1
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaGalpones = [...this.listaTemp];
  }

  sortBy(criteria: string) {
    if (criteria === 'id') {
      this.listaGalpones.sort((a, b) => (a.id > b.id) ? 1 : -1);
    } else if (criteria === 'nombre') {
      this.listaGalpones.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
    } else if (criteria === 'tipogalpon') {
      this.listaGalpones.sort((a, b) => (a.tipogalpon > b.tipogalpon) ? 1 : -1);
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
        // console.log(this.listaGranjas)
        this._chRef.detectChanges();
      }
    })
  }

  getGalpones(event:any){
    let idGalpon = event.detail.value;
    this._galponService.getGalponByIdGranja(idGalpon).subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      }else{
        this.listaTemp = data.result;
        this.listaGalpones = data.result;
        console.log(this.listaGalpones)
        this._chRef.detectChanges();
      }
    })
  }

  GetTipoGalpon(){
    this._listasService.getListas(Listas.tipoGalpon).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaTipoGalpon = data.result
        // console.log(this.listaTipoGalpon)
      }
    })
  }

  calculateArea() {
    const largo = this.GalponesForm.get('largo').value;
    const ancho = this.GalponesForm.get('ancho').value;
  
    if (largo && ancho) {
      this.area = largo * ancho;
    } else {
      this.area = null; // puedes ponerlo a null o 0 si los campos no están llenos
    }
  }

  SaveOrUpdate(){
    if(this.edit==true){
      this.ActualizarGalpon();
    }else{
      this.RegistrarGalpones();
    }
  }
  

  RegistrarGalpones(){
    if (this.GalponesForm.valid){
      let data = this.GalponesForm.value;
      data.idUsuarioRegistro = this._auth.getUser().Id;
      this._galponService.createGalpon(data).subscribe((data:any)=>{
        if(data.error){
          this._alerts.presentToast("top",data.message,"warning");
        }else{
          this._alerts.presentToast("top","Galpon Creado con Exito","success");
          this.GalponesForm.reset();
          this.segmentValue = 'listado_galpones';  
          // Añadir el nuevo galpón al array
          if (data.newGalpon) {
            this.listaGalpones.push(data.newGalpon);
          }
        }
      });
    }
  }

  ActualizarGalpon(){
    let data = this.GalponesForm.value;
    data.idUsuarioRegistro = this._auth.getUser().Id;
    console.log(data)
    this._galponService.updateGalpon(this.idGalpon,data).subscribe((data:any)=>{
      if(data.error){
        this._alerts.warning(data.message,"Atencion");
      }else{
        this.GalponesForm.reset();
        this.segmentValue = 'listado_galpones';
        if(this._alerts.success("Galpon Actualizado con Éxito")){
          if (data.newGalpon) {
            this.listaGalpones.push(data.newGalpon);
          }
        }
      }
    })
  }

  MostrarDatosGalpon(idGalpon:number){
    this.edit=true
    this.idGalpon=idGalpon
    const galponSeleccionado = this.listaGalpones.find(galpon => galpon.id === idGalpon);
    console.log(galponSeleccionado)
    if (galponSeleccionado){
      this.segmentValue = 'registro_galpones'
      this.GalponesForm.patchValue({
        nombre: galponSeleccionado.nombre,
        tipogalpon: galponSeleccionado.tipogalpon,
        ancho: galponSeleccionado.ancho,
        largo: galponSeleccionado.largo,
    });
    }
  }

  async MostrarModalGalpon(idTipoGalpon: number) {
    const galponSeleccionado = this.listaGalpones.find(galpon => galpon.id === idTipoGalpon);
    if (galponSeleccionado) {
      const modal = await this.modalCtrl.create({
        component: GalponesModalComponent,
        componentProps: {
          galpon: galponSeleccionado,
        }
      });
      return await modal.present();
    }
  }
  

  eliminarGalpon(idGalpon: string) {
    this._galponService.deleteGalpon(idGalpon).subscribe(response => {
          console.log('Galpon eliminada con éxito:', response);
          this.listaGalpones = this.listaGalpones.filter(galpon => galpon.id !== idGalpon);
        },
        error => {
          console.error('Error al eliminar la Galpon:', error);
        }
      );
  }
  
  goBack() {
    this.GalponesForm.reset();
    this.segmentValue = 'listado_galpones';
  }

  resetForm() {
    this.GalponesForm.reset();
  }

}
