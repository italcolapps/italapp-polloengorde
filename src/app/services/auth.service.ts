import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../interfaces/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  User:any

  constructor(
    private _encryptService:CryptoService,
    private _router:Router,
    private _jwtHelper: JwtHelperService,
  ) { }


  isAuthenticated():boolean{
    let flag = false;
    try {
      let tokenEncrypt = localStorage.getItem("jwt");
      let token = this._encryptService.decrypt(tokenEncrypt!);
      flag = !this._jwtHelper.isTokenExpired(token);
    } catch (error) {
      flag = false;
    }
    return flag;
  }

  //  dianamarcela_10.18@hotmail.com
  //  123456789

  //ing.dianacontreras@gmail.com


  setUserLogin(data:any){
    let token = data.token;
            let tokenEncrypt = this._encryptService.encrypt(token);
            localStorage.setItem("jwt", tokenEncrypt);
            let dataForUser = this._jwtHelper.decodeToken(token);
            this.setUser(dataForUser.payLoad.user);
            console.log(this.setUser(dataForUser.payLoad.user))
        
            this._router.navigate(['/home']);
            localStorage.setItem("user", JSON.stringify(dataForUser.payLoad.user.Nombre + " " + dataForUser.payLoad.user.Apellido))
  }


  
  setUser(user:Usuario){
    this.User = <Usuario>user;
  }

  getUser(){
    let tokenEncrypt = localStorage.getItem("jwt");
    let token = this._encryptService.decrypt(tokenEncrypt!);
    let dataForUser = this._jwtHelper.decodeToken(token);
    this.setUser(dataForUser.payLoad.user);
    return this.User;
  }

  getUserName(){
    let username = localStorage.getItem("user");
    return username
  }

  logOut():void{
    this.cleanSession();
    this._router.navigate(['/login']);
    location.reload();
  }

  getRol(){
    return this.getUser()?.Rol;
  }

  cleanSession():void{
    localStorage.clear();
    sessionStorage.clear();
    this.User = undefined;
  }

}

