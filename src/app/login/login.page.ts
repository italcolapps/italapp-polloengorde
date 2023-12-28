import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private menu: MenuController,
    private _LoginService: LoginService,
    private _router: Router,
    private _fb:FormBuilder,
    private  _auth:AuthService,
    private _utilidadService:AlertsService) { }

    loginForm: FormGroup= this._fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    })

  ngOnInit() {
    if(this._auth.isAuthenticated()){
      this._router.navigate(['']);
      this._utilidadService.presentToast("bottom","Inicio de Sesion Exitoso!", "info");
    }
  }

  
  ionViewWillEnter() {
    this.menu.enable(false);
    if(this._auth.isAuthenticated()){
      this._router.navigate(['']);
    }
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  loginUser(){
    this._auth.cleanSession();
    if (this.loginForm.valid){
      let data = this.loginForm.value;
      this._LoginService.logIn(data).subscribe((x:any)=>{
        if(x.error){
          this._utilidadService.presentToast("bottom",`${x.message}`,"error");
        }else{
          this._auth.setUserLogin(x.result);
          this.loginForm.reset();
        }
      });
    }else{
      this._utilidadService.presentToast("bottom","Credenciales Incorrectas , Verificar informacion del Usuario", "warning");
    }
  }

}
