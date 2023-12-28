import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Roles } from './interfaces/roles';
import { RolesService } from './services/roles.service';
import { PlantaService } from './services/planta.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  roles = Roles;
  userName = "";
  rol = 0;
  email = "";
  rolname="";
  listaRoles:any=[];
  idUser:number;
  planta ="";
  
  constructor(
    private _auth:AuthService,
    private _router:Router,
    private _cdref: ChangeDetectorRef,
    private _rolService: RolesService,
    private _plantaService:PlantaService,
    private _chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if(this._auth.isAuthenticated()){
      this.idUser = this._auth.getUser().Id;
      this.getUserName();
      this.getRol();
      this.getListaRoles();
    }
  }

  ionViewWillEnter() {
    if(this._auth.isAuthenticated()){
      this.getUserName();
      this.getRol();
      this.getPlantaUser();
    }
  }

  getUserName(){
    if (this.userName == ''){
      this.userName = this._auth.getUser().Nombre + ' ' + this._auth.getUser().Apellido
      this.email = this._auth.getUser().Email
    }
    console.log(this.userName)
    return this.userName;
  }

  getListaRoles(){
    this._rolService.getListaRoles().subscribe((data:any)=>{
      if(data.error){
        console.error("data.message");
      }else{
        this.listaRoles = data.result
        const nombre_rol = this.listaRoles.find(rol => rol.id === this.rol)
        this.rolname = nombre_rol.nombre
      }
    })
  }

  getRol(){
    this.rol = this._auth.getRol();
    return this._auth.getRol();
  }

  getPlantaUser(){
    this._plantaService.GetPlantaByIdUser(this.idUser).subscribe((data:any)=>{
      if (data.error){
        console.log(`Error:${data.message} - code: ${data.codError} - ${data.result}`)
      }else{
        this.planta = data.nombre
        console.log(this.planta)
        this._chRef.detectChanges()
      }
    })
  }

  signOut(){
    this._auth.cleanSession();
    this._router.navigate(['/login']);
    location.reload();
  }
}
