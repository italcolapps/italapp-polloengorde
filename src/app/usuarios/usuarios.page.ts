import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable'; 
import { Usuario } from '../interfaces/usuario';
import { Roles } from '../interfaces/roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';
import { UsersService } from '../services/users.service';
import { RolesService } from '../services/roles.service';
import { PlantaService } from '../services/planta.service';
import { ClienteService } from '../services/cliente.service';
import { ListasService } from '../services/listas.service';
import { Listas } from '../interfaces/listas';
import { UsuarioModalComponent } from '../components/usuario-modal/usuario-modal.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit { 
listaUsuarios:any[] =[];
listaTipoDocumento:any=[]
listaRoles:any[]=[]
listaPlanta:any=[]
listaZona:any=[]
listaClientes:any=[];
listaTemp:any[]=[];
roles=Roles;
idUser:number;
segmentValue: string = 'listado_usuarios';
searchTerm:string = ''
edit:boolean = false;

  constructor(
    private _fb:FormBuilder,
    private _routerNav:Router,
    private _authService:AuthService,
    private _alerts:AlertsService,
    private _listasService:ListasService,
    private _router: ActivatedRoute,
    private _userServices:UsersService,
    private _rolService:RolesService,
    private _plantaService:PlantaService,
    private _chRef: ChangeDetectorRef,
    private _clienteService:ClienteService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getListaUsuarios();
    this.getListaRoles();
    this.getPlanta();
    this.getListClientes();
    this.GetTipoDocumento();
  }

  UsuariosForm:FormGroup = this._fb.group({
    idTipoDocumento:[null,[Validators.required]],
    documento:["",[Validators.required]],
    nombre:["",[Validators.required]],
    apellido:["",[Validators.required]],
    telefono:["",[Validators.required]],
    email:["",[Validators.required, Validators.email]],
    rol:[null,[Validators.required]],
    listPlanta:[null,[Validators.required]],
    listZona:[null,[Validators.required]],
    listCliente:[null,[Validators.required]],
  })


  segmentChanged(event: any) {
    console.log('Valor seleccionado:', event.detail.value);
    // Puedes agregar aquí más lógica si es necesario
  }

  handleChange(event: any){
    const query = event.target.value.toLowerCase();
    this.listaUsuarios = [...this.listaTemp];
    this.listaUsuarios = this.listaUsuarios.filter((d:any) => 
    d.nombre.toLowerCase().indexOf(query) > -1 || 
    d.apellido.toLowerCase().indexOf(query) > -1 || 
    d.documento.toLowerCase().indexOf(query) > -1 || 
    d.rolText.toLowerCase().indexOf(query) > -1);
  }

  clearSearch() {
    this.searchTerm = '';
    this.listaUsuarios = [...this.listaTemp];
  }

  sortBy(criteria: string) {
    const sortMapping = {
      'documento': (a, b) => (a.documento > b.documento) ? 1 : -1,
      'nombre': (a, b) => (a.nombre > b.nombre) ? 1 : -1,
      'rol': (a, b) => (a.rolText > b.rolText) ? 1 : -1
    };
    if (sortMapping[criteria]) {
      this.listaUsuarios.sort(sortMapping[criteria]);
    }
}

  getListaUsuarios(){
    this._userServices.getListaUsers().subscribe((data:any)=>{
      if(data.error){
        this._alerts.presentToast("top",data.message,"warning");
      }else{
        this.listaUsuarios = data.result;
        this.listaTemp = data.result;
        console.log(this.listaUsuarios)
      }
    });
  }

  
  SaveOrUpdate(){
    if(this.edit==true){
      this.ActualizarUsuario();
    }else{
      this.registerUsuarios();
    }
  }


  registerUsuarios(){
    this.edit=false;
    if(this.UsuariosForm.valid){
      let data = this.UsuariosForm.value;
      data.idUsuarioRegistro = this._authService.getUser().Id;
      data.password = '0123456789'
      console.log(data);
      this._userServices.createUser(data).subscribe((x: any) => {
        if(x.error){
          this._alerts.presentToast("top",x.message,"warning");
          console.log(x)
        }else{
          this._alerts.presentToast("top","Usuario Creado Con Exito",'success');
          this.UsuariosForm.reset();
          this.segmentValue = 'listado_usuarios';
          window.location.reload();
        }
      });
    }else{
      this._alerts.presentToast("top","Verificar la información de los campos marcados en rojo","warning");
    }
  }

  ActualizarUsuario(){
    let data = this.UsuariosForm.value;
    data.idUsuarioRegistro = this._authService.getUser().Id;
    data.password = '0123456789'
    console.log(data);
    this._userServices.updateUser(this.idUser,data).subscribe((data:any)=>{
    if(data.error){
      this._alerts.warning(data.message, "Atención"); 
    }else{
      this._alerts.presentToast("top","Cliente Creado con Exito","success");
      this.UsuariosForm.reset();
      this.segmentValue = 'listado_usuarios';
      window.location.reload();
    }
    })
  }

  MostrarDatosUsuario(idUsuario:number){
    this.edit = true;
    this.idUser = idUsuario;
    const usuarioSeleccionado = this.listaUsuarios.find(usuario => usuario.id === idUsuario);
    console.log('datos del usuario',usuarioSeleccionado);
    if (usuarioSeleccionado){
      this.segmentValue = 'registro_usuarios';
      this.UsuariosForm.patchValue({
        documento: usuarioSeleccionado.documento,
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        email: usuarioSeleccionado.email,
        rol: usuarioSeleccionado.idRol,
    });
    }
  }

  async MostrarModalUsuario(idUsuario: number) {
    const usuarioSeleccionado = this.listaUsuarios.find(usuario => usuario.id === idUsuario);
    if (usuarioSeleccionado) {
      const modal = await this.modalCtrl.create({
        component: UsuarioModalComponent,
        componentProps: {
          usuario: usuarioSeleccionado
        }
      });
      return await modal.present();
    }
  }
  

  GetTipoDocumento(){
    this._listasService.getListas(Listas.tipoDocumento).subscribe((data:any)=>{
      if(data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaTipoDocumento = data.result
        console.log(this.listaTipoDocumento)
      }
    })
  }

  getListaRoles(){
    this._rolService.getListaRoles().subscribe((data:any)=>{
      if(data.error){
        this._alerts.presentToast("top",data.message,"warning");
      }else{
        this.listaRoles = data.result;
        console.log(this.listaRoles)
      }
    });
  }

  getPlanta(){
    this._plantaService.getListaPlanta().subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.listaPlanta = data.result
        console.log(this.listaPlanta)
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
        console.log(this.listaZona)
      }
    })
  }

  getListClientes() {
    this._clienteService.getListaClientes().subscribe((data:any)=>{
      if(data.error){
        console.error("data.message");
      }else{
        this.listaClientes = data.result
      }
    })
  }

  goBack() {
    this.UsuariosForm.reset();
    this.segmentValue = 'listado_usuarios';
  }

  resetForm() {
    this.UsuariosForm.reset();
  }



    


}
