import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { CryptoService } from './services/crypto.service';
import { ServiceWorkerModule } from '@angular/service-worker';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');


export function getToken():string{
  let crypto = new CryptoService();
  let trytoken = localStorage.getItem("jwt")
  let token = "";
  if(trytoken != null){
    token = crypto.decrypt(trytoken)
  }
  return token;
}


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule, 
            HttpClientModule, 
            BrowserAnimationsModule,
            ReactiveFormsModule,
            JwtModule.forRoot({
              config:{
                tokenGetter: getToken
              } 
            }),
            ServiceWorkerModule.register('ngsw-worker.js', {
              enabled: !isDevMode(),
              // Register the ServiceWorker as soon as the application is stable
              // or after 30 seconds (whichever comes first).
              registrationStrategy: 'registerWhenStable:30000'
            }),

            ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
