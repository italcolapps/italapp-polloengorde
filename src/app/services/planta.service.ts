import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';


@Injectable({
  providedIn: 'root'
})
export class PlantaService {
  private readonly Planta = 'Planta';
  private readonly Zona = 'Zona';
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

  getListaPlanta() {
    return this._http.get(`${this.urlApi}/${this.Planta}/`, this.getHeaders());
  }

  getListaZona(id:number){
    return this._http.get(`${this.urlApi}/${this.Zona}/GetZonaByIdPlanta/${id}`, this.getHeaders());
  }

  GetPlantaByIdUser(id:number){
    return this._http.get(`${this.urlApi}/${this.Planta}/GetPlantaByIdUser/${id}`, this.getHeaders());
  }

  


}
