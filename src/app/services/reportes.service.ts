import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private readonly Reportes = 'Reportes';
  private readonly urlApi = this.__env.apiUrl;
  private headers: HttpHeaders;

  constructor(
    private __env: EnvService,
    private _http: HttpClient,
    private _encryptService: CryptoService
  ) { 
    this.initializeHeaders();
  }

  private initializeHeaders() {
    const tokenEncrypt = localStorage.getItem('jwt');
    if (tokenEncrypt) {
      const token = this._encryptService.decrypt(tokenEncrypt);
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      this.headers = new HttpHeaders();
    }
  }

  private getHeaders() {
    return { headers: this.headers };
  }

  getReporteDesempenoProductivoActual(idCliente: number, IdGranja: number, IdGalpon : number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteDesempenoProductivoActual/${idCliente}/${IdGranja}/${IdGalpon}/${IdLote}`, this.getHeaders());
  }

  getReporteMortalidadSeleccionAct(idCliente: number, IdGranja: number, IdGalpon : number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteMortalidadSeleccionAct/${idCliente}/${IdGranja}/${IdGalpon}/${IdLote}`, this.getHeaders());
  }

  getReporteDesempenoProductivoVsGuia(idCliente: number, IdGranja: number, IdGalpon : number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteDesempenoProductivoVSguia/${idCliente}/${IdGranja}/${IdGalpon}/${IdLote}`, this.getHeaders());
  }

  getReporteDesempenoActualVSHistoricos(idCliente: number, IdGranja: number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteDesempenoActualVSHistoricos/${idCliente}/${IdGranja}/${IdLote}`, this.getHeaders());
  }

  getReporteDesempenoProductivoLiquidacion(idCliente: number, IdGranja: number, IdGalpon : number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteDesempenoProductivoLiq/${idCliente}/${IdGranja}/${IdGalpon}/${IdLote}`, this.getHeaders());
  }

  getReporteDesempenoHistoricoLiq(idCliente: number, IdGranja: number){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteDesempenoHistoricoLiq/${idCliente}/${IdGranja}`, this.getHeaders());
  }

  getReporteLiquidacionDifGuia(idCliente: number, IdGranja: number, IdGalpon : number, IdLote : number,){
    return this._http.get(`${this.urlApi}/${this.Reportes}/ReporteLiquidacionDifGuia/${idCliente}/${IdGranja}/${IdGalpon}/${IdLote}`, this.getHeaders());
  }

  

}
