import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class GalponService {
  private readonly Galpon = 'Galpon';
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

  getListaGalpones() {
    return this._http.get(`${this.urlApi}/${this.Galpon}/`, this.getHeaders());
  }

  createGalpon(data:any){
    return this._http.post(`${this.urlApi}/${this.Galpon}/`,data, this.getHeaders());
  }

  getGalponByIdGranja(idGranja: number) {
    return this._http.get(`${this.urlApi}/${this.Galpon}/GetGalponByIdGranja/${idGranja}`, this.getHeaders());
  }

  updateGalpon(idGalpon: number, data: any) {
    return this._http.put(`${this.urlApi}/${this.Galpon}/${idGalpon}`, data, this.getHeaders());
  }

  deleteGalpon(idGalpon: string){
    return this._http.delete(`${this.urlApi}/${this.Galpon}/${idGalpon}`, this.getHeaders());
  }

}
