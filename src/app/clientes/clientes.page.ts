import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { PlantaService } from '../services/planta.service';

import { ListasService } from '../services/listas.service';
import { Listas } from '../interfaces/listas';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ClienteModalComponent } from '../components/cliente-modal/cliente-modal.component';
import { RolesService } from '../services/roles.service';
import { Planta } from '../interfaces/planta';
import { Rol } from '../interfaces/rol';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  listaClientes:any=[];
  listaPlanta:any=[]
  listaZona:any=[]
  listaPais:any=[]
  listaRoles:any=[];
  listaDepartamento:any=[]
  listaMuncipio:any=[]
  listaTemp:any[]=[];
  listaTipoDocumento:any=[]
  listaTipoCliente:any=[]
  idCliente:number
  idUser:number;
  client :any;
  segmentValue: string = 'listado_clientes';
  searchTerm:string = ''
  edit:boolean = false;

  constructor(
    private _fb:FormBuilder,
    private _routerNav:Router,
    private modalCtrl: ModalController,
    private _clienteService:ClienteService,
    private _plantaService:PlantaService,
    private _auth:AuthService,
    private _alert:AlertsService,
    private _listasService:ListasService,
    private _rolService: RolesService,
    private _chRef: ChangeDetectorRef
  ) {
    }

  ngOnInit() {
    this.idUser = this._auth.getUser().Id;
    this.getPlanta();
    this.getPais();
    this.GetTipoDocumento();
    this.GetTipoCliente();
  }



  ClienteForm:FormGroup = this._fb.group({
    idDocumento:[null,[Validators.required]],
    numeroDocumento:["",[Validators.required, Validators.pattern('^[0-9]*$')]],
    nombre:["",[Validators.required]],
    email:["",[Validators.required]],
    telefono:["",[Validators.required]],
    idTipoCliente:[null,[Validators.required]],
    idPais:[null,[Validators.required]],
    idDepartamento:[null,[Validators.required]],
    idMunicipio:[null,[Validators.required]],
    listZona: [null,[Validators.required]],
  })


  ionViewWillEnter() {
    this.getListClientes();
  }

  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
  }

  handleChange(event:any) {
    const query = event.target.value.toLowerCase();
    this.listaClientes = [...this.listaTemp];
    this.listaClientes = this.listaClientes.filter((d:any) => 
    d.nombre.toLowerCase().indexOf(query) > -1 || 
    d.numeroDocumento.toLowerCase().indexOf(query) > -1 || 
    d.tipoclienteText.toLowerCase().indexOf(query) > -1);
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaClientes = [...this.listaTemp];
  }


  sortBy(criteria: string) {
    const sortOptions = {
      'numeroDocumento': (a, b) => (a.numeroDocumento > b.numeroDocumento) ? 1 : -1,
      'nombre': (a, b) => (a.nombre > b.nombre) ? 1 : -1,
      'tipo_cliente': (a, b) => (a.tipoclienteText > b.tipoclienteText) ? 1 : -1
    };

    if (sortOptions[criteria]) {
      this.listaClientes.sort(sortOptions[criteria]);
    }
  }

  SaveOrUpdate(){
    if(this.edit==true){
      this.ActualizarCliente();
    }else{
      this.RegistrarCliente();
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
        console.log(usuarioActual);
        console.log(this.listaClientes);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

  
  RegistrarCliente(){
    this.edit=false;
    if (this.ClienteForm.valid){
      let data = this.ClienteForm.value;
      data.idUsuarioRegistro = this._auth.getUser().Id;
      console.log(data);
      this._clienteService.createCliente(data).subscribe((x:any)=>{
        if(x.error){
          this._alert.presentToast("top",x.message,"warning");
        }else{
          this._alert.presentToast("top","Cliente Creado con Exito","success");
          this.ClienteForm.reset();
          this.segmentValue = 'listado_clientes';
          window.location.reload();
        }
      });
    }
  }

  ActualizarCliente(){
    let data = this.ClienteForm.value;
    this._clienteService.updateCliente(this.idCliente,data).subscribe((data:any)=>{
      if(data.error){
        this._alert.warning(data.message, "Atención"); 
      }else{
          this.ClienteForm.reset();
          this.segmentValue = 'listado_clientes';
          if(this._alert.success("Cliente Actualizado con Éxito")){
            window.location.reload();
          }
      }
    })
  }

  MostrarDatosCliente(idCliente: number) {
    this.edit=true;
    this.idCliente = idCliente;
    const clienteSeleccionado = this.listaClientes.find(cliente => cliente.id === idCliente);
    console.log(clienteSeleccionado)
    if (clienteSeleccionado) {
        this.segmentValue = 'registro_clientes';
        this.ClienteForm.patchValue({
            idDocumento: clienteSeleccionado.idDocumentoLista,
            numeroDocumento: clienteSeleccionado.numeroDocumento,
            nombre: clienteSeleccionado.nombre,
            email: clienteSeleccionado.email,
            telefono: clienteSeleccionado.telefono,
            idTipoCliente: clienteSeleccionado.idTipoClienteLista,
            idPais: clienteSeleccionado.idPais,
        });
    }
}

async MostrarModalCliente(idCliente: number) {
  const clienteSeleccionado = this.listaClientes.find(cliente => cliente.id === idCliente);
  if (clienteSeleccionado) {
    const modal = await this.modalCtrl.create({
      component: ClienteModalComponent,
      componentProps: {
        cliente: clienteSeleccionado
      }
    });
    return await modal.present();
  }
}

eliminarCliente(clienteId: string) {
  this._clienteService.deleteCliente(clienteId).subscribe(
    response => {
      console.log('Cliente eliminado con éxito');
      // Aquí puedes actualizar la lista de clientes, mostrando un mensaje, etc.
      this.listaClientes = this.listaClientes.filter(cliente => cliente.id !== clienteId);
    },
    error => {
      console.error('Error eliminando el cliente:', error);
      // Aquí puedes manejar los errores, mostrando un mensaje de error, etc.
    }
  );
}

  mostrarValorSeleccionado(event: CustomEvent) {
    console.log('Valor seleccionado:', event.detail.value);
  }

  getCliente(){
    this._clienteService.getCliente(this.idCliente).subscribe((data:any)=>{
      if(data.error){
        this._alert.presentToast("top",data.message,"warning");
      } else {
        this.client = data.result;
      }
    });
  }

  GetTipoDocumento(){
    this._listasService.getListas(Listas.tipoDocumento).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaTipoDocumento = data.result
      }
    })
  }

  GetTipoCliente(){
    this._listasService.getListas(Listas.tipoCliente).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaTipoCliente = data.result
      }
    })
  }
  

  getPlanta(){
    this._plantaService.getListaPlanta().subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaPlanta = data.result
      }
    })
  }

  getZona(event:any){
    let idPlanta = event.detail.value;
    this._plantaService.getListaZona(idPlanta).subscribe((data:any) =>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`);
      }else{
        this.listaZona = data.result;
        this._chRef.detectChanges();
      }
    })
  }

  getPais(){
    this._listasService.getListaPais().subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaPais = data.result;
        
      }
    })
  }
  
  getDepartamento(event:any){
    let idPais = event.detail.value;
    this._listasService.getListaDepartamento(idPais).subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
        }else{
          this.listaDepartamento= data.result;
          this._chRef.detectChanges()
        }
    })
  }

  getMunicipio(event:any){
    let idDepartamento = event.detail.value;
    this._listasService.getListaMunicipio(idDepartamento).subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaMuncipio = data.result;
        this._chRef.detectChanges()
      }
    })
  }

  goBack() {
    this.ClienteForm.reset();
    this.segmentValue = 'listado_clientes';
  }

  resetForm() {
    this.ClienteForm.reset();
  }


}
