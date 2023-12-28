import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardRoleGuard implements CanActivate {

  constructor(
    private _authSrv:AuthService,
    private _router:Router
  ){

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      ////debuger;
      let roles = route.data["roles"] as Array<number>;
      let rolUser = this._authSrv.getUser().Rol;
      if(roles.includes(rolUser)){
        return true;
      }
      return false;
  }
  
}
