import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../interfaces/usuario';
import { InicialService } from './inicial.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: Usuario | undefined;

  constructor(
    private _encryptService: CryptoService,
    private _router: Router,
    private _jwtHelper: JwtHelperService,
    private _initSrv: InicialService
  ) { }

  isAuthenticated(): boolean {
    try {
      const token = this._encryptService.decrypt(localStorage.getItem("jwt")!);
      return !this._jwtHelper.isTokenExpired(token);
    } catch (error) {
      return false;
    }
  }

  async setUserLogin(data: any): Promise<void> {
    const token = data.token;
    const tokenEncrypt = this._encryptService.encrypt(token);
    localStorage.setItem("jwt", tokenEncrypt);

    const dataForUser = this._jwtHelper.decodeToken(token);
    this.setUser(dataForUser.payLoad.user);

    this._router.navigate(['/home']);
    localStorage.setItem("user", JSON.stringify(dataForUser.payLoad.user.Nombre + " " + dataForUser.payLoad.user.Apellido));
  }

  setUser(user: Usuario): void {
    this.user = user;
  }

  getUser(): Usuario | undefined {
    const tokenEncrypt = localStorage.getItem("jwt");
    const token = this._encryptService.decrypt(tokenEncrypt!);
    const dataForUser = this._jwtHelper.decodeToken(token);
    this.setUser(dataForUser.payLoad.user);
    return this.user;
  }

  logOut(): void {
    this.cleanSession();
    this._router.navigate(['/login']);
    location.reload();
  }

  getRol(): number | undefined {
    return this.getUser()?.rol;
  }

  cleanSession(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.user = undefined;
  }
}