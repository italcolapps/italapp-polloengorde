import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Roles } from '../interfaces/roles';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  datos: any;
  roles = Roles;
  userName = "";
  rol = 0;

  constructor(
    private  _auth:AuthService,
    private _router:Router
    ) {}

  ngOnInit() {
    this.checkAndReload();
  }

  ionViewWillEnter() {
    this.checkAndReload();
  }

  checkAndReload() {
    // Comprobar si ya se ha recargado la página
    const isReloaded = localStorage.getItem('reloaded');

    if (!isReloaded) {
      // Marcar como recargado
      localStorage.setItem('reloaded', 'true');

      // Recargar la página
      window.location.reload();
    }
  }

  getUserName(){
    if (this.userName == ''){
      this.userName = this._auth.getUser().Nombre + ' ' + this._auth.getUser().Apellido
    }
    console.log(this.userName)
    return this.userName;
  }

  getRol(){
    this.rol = this._auth.getRol();
    return this._auth.getRol();
  }

  signOut(){
    this._auth.cleanSession();
    this._router.navigate(['/login']);
    location.reload();
  }




}
