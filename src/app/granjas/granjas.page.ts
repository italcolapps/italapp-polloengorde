import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Granja } from '../interfaces/granja';
import { granjas } from 'src/assets/data/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { UsersService } from '../services/users.service';
import { ClienteService } from '../services/cliente.service';
import { GranjaService } from '../services/granja.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { GranjaModalComponent } from '../components/granja-modal/granja-modal.component';
import { Rol } from '../interfaces/rol';
import { Planta } from '../interfaces/planta';
import { PlantaService } from '../services/planta.service';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-granjas',
  templateUrl: './granjas.page.html',
  styleUrls: ['./granjas.page.scss'],
})
export class GranjasPage implements OnInit {
  segmentValue: string = 'listado_granjas';
  searchTerm: string = '';
  edit:boolean = false;
  idGranja:number

  listaClientes:any=[];
  listaGranjas:any=[];
  listaTemp:any[]=[];

  constructor(
    private _fb:FormBuilder,
    private _routerNav:Router,
    private _auth:AuthService,
    private _alerts:AlertsService,
    private _router: ActivatedRoute,
    private _userServices:UsersService,
    private _chRef: ChangeDetectorRef,
    private _clienteService:ClienteService,
    private _granjaService:GranjaService,
    private _plantaService:PlantaService,
    private _rolService: RolesService,
    private geolocation: Geolocation,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.getListClientes();
  }

  GranjasForm:FormGroup = this._fb.group({
    nombre: ["",[Validators.required]],  
    latitud: [null,[Validators.required]],
    longitud: [null,[Validators.required]], 
    certificadoGab: [true,[Validators.required]], 
    idCliente: [null,[Validators.required]],  
  })

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaGranjas = [...this.listaTemp];
    this.listaGranjas = this.listaGranjas.filter((d:any) => 
    d.nombre.toLowerCase().indexOf(query) > -1 || 
    d.longitud.toString().indexOf(query) > -1 ||
    d.latitud.toString().indexOf(query) > -1
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaGranjas = [...this.listaTemp];
  }

  sortBy(criteria: string) {
    if (criteria === 'id') {
      this.listaGranjas.sort((a, b) => (a.id > b.id) ? 1 : -1);
    } else if (criteria === 'nombre') {
      this.listaGranjas.sort((a, b) => (a.nombre > b.nombre) ? 1 : -1);
    } else if (criteria === 'latitud') {
      this.listaGranjas.sort((a, b) => (a.latitud > b.latitud) ? 1 : -1);
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
        this.listaTemp = data.result;
        this.listaGranjas = data.result;
        console.log(this.listaGranjas)
        this._chRef.detectChanges();
      }
    })
  }

  SaveOrUpdate(){
    if(this.edit==true){
      this.ActualizarGranja();
    }else{
      this.RegistrarGranja();
    }
  }
  
  getCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.GranjasForm.patchValue({
        latitud: resp.coords.latitude,
        longitud: resp.coords.longitude
      });
    }).catch((error) => {
      console.log('Error al obtener la ubicación', error);
    });
  }

  RegistrarGranja(){
    if (this.GranjasForm.valid){
      let data = this.GranjasForm.value;
      data.idUsuarioRegistro = this._auth.getUser().Id;
      console.log(data);
      this._granjaService.createGranja(data).subscribe((x:any)=>{
        if(x.error){
          this._alerts.presentToast("top",x.message,"warning");
        }else{
          this._alerts.presentToast("top","Granja Creada con Exito","success");
          this.GranjasForm.reset();
          this.segmentValue = 'listado_granjas';
        }
      });
    }
  }

  ActualizarGranja(){
    let data = this.GranjasForm.value;
    data.idUsuarioRegistro = this._auth.getUser().Id;
    console.log(data)
    this._granjaService.updateGranja(this.idGranja,data).subscribe((data:any)=>{
      if(data.error){
        this._alerts.warning(data.message,"Atencion");
      }else{
        this.GranjasForm.reset();
        this.segmentValue = 'listado_granjas';
        if(this._alerts.success("Cliente Actualizado con Éxito")){
          window.location.reload();
        }
      }
    })
  }

  MostrarDatosGranja(idGranja:number){
    this.edit=true
    this.idGranja=idGranja
    const granjaSeleccionada = this.listaGranjas.find(granja => granja.id === idGranja);
    // console.log(granjaSeleccionada)
    if (granjaSeleccionada){
      this.segmentValue = 'registro_granjas'
      this.GranjasForm.patchValue({
        nombre: granjaSeleccionada.nombre,
        certificadoGab: granjaSeleccionada.certificadoGab,
        latitud: granjaSeleccionada.latitud,
        longitud: granjaSeleccionada.longitud,
    });
    }
  }

  async MostrarModalGranja(idGranja: number) {
    const granjaSeleccionada = this.listaGranjas.find(granja => granja.id === idGranja);
    if (granjaSeleccionada) {
      const modal = await this.modalCtrl.create({
        component: GranjaModalComponent,
        componentProps: {
          granja: granjaSeleccionada,
        }
      });
      return await modal.present();
    }
  }
  

  eliminarGranja(idGranja: string) {
    this._granjaService.deleteGranja(idGranja).subscribe(response => {
          console.log('Granja eliminada con éxito:', response);
          this.listaGranjas = this.listaGranjas.filter(granja => granja.id !== idGranja);
        },
        error => {
          console.error('Error al eliminar la granja:', error);
        }
      );
  }

  goBack() {
    this.GranjasForm.reset();
    this.segmentValue = 'listado_granjas';
  }

  resetForm() {
    this.GranjasForm.reset();
  }


}
