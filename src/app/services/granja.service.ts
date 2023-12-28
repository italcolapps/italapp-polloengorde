import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class GranjaService {
  private readonly Granja = 'Granja';
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

  getListaGranjas() {
    return this._http.get(`${this.urlApi}/${this.Granja}/`, this.getHeaders());
  }

  createGranja(data:any){
    return this._http.post(`${this.urlApi}/${this.Granja}/`,data, this.getHeaders());
  }

  getGranjaByIdCliente(idCliente: number) {
    return this._http.get(`${this.urlApi}/${this.Granja}/GetGranjaByIdCliente/${idCliente}`, this.getHeaders());
  }

  updateGranja(idGranja: number, data: any) {
    return this._http.put(`${this.urlApi}/${this.Granja}/${idGranja}`, data, this.getHeaders());
  }

  deleteGranja(idGranja: string){
    return this._http.delete(`${this.urlApi}/${this.Granja}/${idGranja}`, this.getHeaders());
  }
}
